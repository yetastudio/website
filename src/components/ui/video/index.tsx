'use client';

//! React Core
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type VideoSource = { src: string; type?: string };
export type VideoTrack = { src: string; srclang: string; label: string; kind?: 'captions' | 'subtitles'; default?: boolean };
export type VideoAspect = '16/9' | '16/10' | '4/3' | '1/1' | '9/16';

export type VideoLabels = {
	play: string;
	pause: string;
	mute: string;
	unmute: string;
	captions: string;
	fullscreen: string;
	exitFullscreen: string;
	seek: string;
	/** "{current} of {duration}", read by the seek slider. */
	timeOf: (current: string, duration: string) => string;
	unavailable: string;
};

function useDefaultLabels(): VideoLabels {
	const t = useTranslations('common.ui.video');
	return {
		play: t('play'),
		pause: t('pause'),
		mute: t('mute'),
		unmute: t('unmute'),
		captions: t('captions'),
		fullscreen: t('fullscreen'),
		exitFullscreen: t('exitFullscreen'),
		seek: t('seek'),
		timeOf: (current, duration) => t('timeOf', { current, duration }),
		unavailable: t('unavailable'),
	};
}

export type VideoProps = {
	/** One file. Use `sources` to offer several formats. */
	src?: string;
	sources?: VideoSource[];
	/** Still shown before playback (and the only frame under reduced motion with `autoPlay`). */
	poster?: string;
	/** Accessible name of the player ("Case study walkthrough"). */
	title: string;
	/** Caption/subtitle files (WebVTT). The first one drives the Captions button; `default` turns it on. */
	tracks?: VideoTrack[];
	/** Starts muted and only while on screen. Ignored under prefers-reduced-motion: the poster stays until Play. */
	autoPlay?: boolean;
	loop?: boolean;
	muted?: boolean;
	preload?: 'none' | 'metadata' | 'auto';
	aspect?: VideoAspect;
	radius?: 'md' | 'lg' | 'xl' | '2xl';
	/** Renders `figure` + `figcaption` under the player. */
	caption?: ReactNode;
	/** Control names. Default to the page language (`common.ui.video`); override per instance. */
	labels?: Partial<VideoLabels>;
	className?: string;
};

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const IDLE_MS = 2500;
const SEEK_STEP = 5;

function formatTime(seconds: number) {
	if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
	const whole = Math.floor(seconds);
	const h = Math.floor(whole / 3600);
	const m = Math.floor((whole % 3600) / 60);
	const s = String(whole % 60).padStart(2, '0');
	return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** Two icons in one slot that cross-fade with the transitions.dev "Icon swap". */
function SwapIcon({ a, b, showB }: { a: IconName; b: IconName; showB: boolean }) {
	return (
		<span className="t-icon-swap" data-state={showB ? 'b' : 'a'} aria-hidden="true">
			<span className="t-icon" data-icon="a">
				<Icon name={a} size="md" />
			</span>
			<span className="t-icon" data-icon="b">
				<Icon name={b} size="md" />
			</span>
		</span>
	);
}

/**
 * Inspo component (component.gallery "Video"): the native video element with the site's controls on a
 * glass bar: play/pause, seek, time, mute, captions and full screen. Every control is a real button or
 * slider; while focus is inside the player, K (or Space on the video) plays, M mutes, C toggles captions,
 * F goes full screen and the arrow keys seek 5s. Controls fade out during playback after a few idle
 * seconds and stay up while paused, hovered or focused. Captions are drawn by the component, above the bar.
 */
export function Video({
	src,
	sources,
	poster,
	title,
	tracks = [],
	autoPlay = false,
	loop = false,
	muted: initialMuted = false,
	preload = 'metadata',
	aspect = '16/9',
	radius = 'xl',
	caption,
	labels: labelOverrides,
	className,
}: VideoProps) {
	const labels = { ...useDefaultLabels(), ...labelOverrides };
	const rootRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const userTookControl = useRef(false);

	const [playing, setPlaying] = useState(false);
	const [started, setStarted] = useState(false);
	const [muted, setMuted] = useState(initialMuted || autoPlay);
	const [current, setCurrent] = useState(0);
	const [duration, setDuration] = useState(0);
	const [waiting, setWaiting] = useState(false);
	const [failed, setFailed] = useState(false);
	const [captionsOn, setCaptionsOn] = useState(() => tracks.some((track) => track.default));
	const [cueText, setCueText] = useState('');
	const [fullscreen, setFullscreen] = useState(false);
	const [canFullscreen, setCanFullscreen] = useState(false);
	const [active, setActive] = useState(false);
	const [focusWithin, setFocusWithin] = useState(false);

	const hasCaptions = tracks.length > 0;

	// Feature check, full-screen state and the (muted, on-screen, motion-allowed) autoplay.
	useEffect(() => {
		const root = rootRef.current;
		const video = videoRef.current;
		if (!root || !video) return;
		const webkitVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
		setCanFullscreen(Boolean(document.fullscreenEnabled || webkitVideo.webkitEnterFullscreen));

		const onFullscreenChange = () => setFullscreen(document.fullscreenElement === root);
		document.addEventListener('fullscreenchange', onFullscreenChange);

		let observer: IntersectionObserver | undefined;
		if (autoPlay && !window.matchMedia(REDUCED_MOTION).matches) {
			video.muted = true;
			observer = new IntersectionObserver(
				([entry]) => {
					if (userTookControl.current) return;
					if (entry.isIntersecting) video.play().catch(() => undefined);
					else video.pause();
				},
				{ threshold: 0.5 }
			);
			observer.observe(root);
		}

		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			observer?.disconnect();
		};
	}, [autoPlay]);

	// Captions: the first track stays `hidden` (the browser draws nothing) and its active cues are drawn here.
	useEffect(() => {
		const video = videoRef.current;
		if (!video || !hasCaptions) return;
		const track = Array.from(video.textTracks).find((item) => item.kind === 'captions' || item.kind === 'subtitles');
		if (!track) return;
		track.mode = 'hidden';
		const onCueChange = () => {
			const cues = Array.from(track.activeCues ?? []) as VTTCue[];
			setCueText(cues.map((cue) => cue.text).join('\n'));
		};
		track.addEventListener('cuechange', onCueChange);
		return () => track.removeEventListener('cuechange', onCueChange);
	}, [hasCaptions]);

	useEffect(() => () => clearTimeout(idleTimer.current), []);

	const wake = useCallback(() => {
		setActive(true);
		clearTimeout(idleTimer.current);
		idleTimer.current = setTimeout(() => setActive(false), IDLE_MS);
	}, []);

	const togglePlay = useCallback(() => {
		const video = videoRef.current;
		if (!video || failed) return;
		userTookControl.current = true;
		if (video.paused || video.ended) video.play().catch(() => undefined);
		else video.pause();
	}, [failed]);

	const toggleMute = useCallback(() => {
		const video = videoRef.current;
		if (!video) return;
		userTookControl.current = true;
		video.muted = !video.muted;
	}, []);

	const toggleCaptions = useCallback(() => setCaptionsOn((on) => !on), []);

	const toggleFullscreen = useCallback(() => {
		const root = rootRef.current;
		const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
		if (!root || !video) return;
		if (document.fullscreenElement) {
			document.exitFullscreen().catch(() => undefined);
		} else if (document.fullscreenEnabled) {
			root.requestFullscreen().catch(() => undefined);
		} else {
			// iOS Safari: only the video element itself can go full screen (native controls take over).
			video.webkitEnterFullscreen?.();
		}
	}, []);

	const seekTo = useCallback((time: number) => {
		const video = videoRef.current;
		if (!video || !Number.isFinite(video.duration)) return;
		video.currentTime = Math.min(Math.max(time, 0), video.duration);
		setCurrent(video.currentTime);
	}, []);

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		const target = event.target as HTMLElement;
		const onSlider = target instanceof HTMLInputElement;
		const onButton = target instanceof HTMLButtonElement;
		const key = event.key.toLowerCase();
		let handled = true;
		if (key === 'k' || (key === ' ' && !onButton && !onSlider)) togglePlay();
		else if (key === 'm') toggleMute();
		else if (key === 'c' && hasCaptions) toggleCaptions();
		else if (key === 'f' && canFullscreen) toggleFullscreen();
		else if (!onSlider && key === 'arrowleft') seekTo(current - SEEK_STEP);
		else if (!onSlider && key === 'arrowright') seekTo(current + SEEK_STEP);
		else handled = false;
		if (handled) {
			event.preventDefault();
			wake();
		}
	};

	const onFocus = () => setFocusWithin(true);
	const onBlur = (event: FocusEvent<HTMLDivElement>) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
	};

	const controlsShown = !playing || active || focusWithin;
	const progress = duration > 0 ? (current / duration) * 100 : 0;

	const player = (
		<div
			ref={rootRef}
			role="group"
			aria-label={title}
			aria-busy={(playing && waiting) || undefined}
			className={cx(styles.player, styles[`aspect-${aspect.replace('/', '-')}`], styles[`radius-${radius}`], 'u-bevel', fullscreen && styles.fullscreen, caption ? undefined : className)}
			data-controls={controlsShown ? 'shown' : 'hidden'}
			onPointerMove={wake}
			onPointerDown={wake}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
		>
			<video
				ref={videoRef}
				className={styles.video}
				src={sources ? undefined : src}
				poster={poster}
				preload={preload}
				loop={loop}
				muted={initialMuted || autoPlay}
				playsInline
				onPlay={() => {
					setPlaying(true);
					setStarted(true);
				}}
				onPause={() => setPlaying(false)}
				onEnded={() => setPlaying(false)}
				onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
				onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
				onDurationChange={(event) => setDuration(event.currentTarget.duration)}
				onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
				onWaiting={() => setWaiting(true)}
				onPlaying={() => setWaiting(false)}
				onCanPlay={() => setWaiting(false)}
				onError={() => setFailed(true)}
			>
				{sources?.map((source, index) => (
					<source key={source.src} src={source.src} type={source.type} onError={index === sources.length - 1 ? () => setFailed(true) : undefined} />
				))}
				{tracks.map((track) => (
					<track key={track.src} kind={track.kind ?? 'captions'} src={track.src} srcLang={track.srclang} label={track.label} default={track.default} />
				))}
			</video>

			{/* Pointer shortcut over the picture: click plays or pauses, double-click goes full screen. It duplicates
			    the bar's buttons, so it stays out of the tab order and the accessibility tree. */}
			<button
				type="button"
				className={styles.surface}
				tabIndex={-1}
				aria-hidden="true"
				onClick={togglePlay}
				onDoubleClick={canFullscreen ? toggleFullscreen : undefined}
			/>

			{!started && !failed && (
				<span className={cx(styles.bigPlay, 'u-bevel')} aria-hidden="true">
					<Icon name="play" size="xl" />
				</span>
			)}

			{playing && waiting && (
				<span className={styles.spinner} aria-hidden="true">
					<Icon name="loader" size="xl" />
				</span>
			)}

			{failed && (
				<div className={styles.error}>
					<Icon name="alert" size="lg" />
					<span>{labels.unavailable}</span>
				</div>
			)}

			{captionsOn && cueText && (
				<div className={styles.cues}>
					<span className={styles.cue}>{cueText}</span>
				</div>
			)}

			<div className={cx(styles.controls, 'u-bevel')} hidden={failed}>
				<Button
					variant="ghost"
					size="md"
					label={playing ? labels.pause : labels.play}
					iconNode={<SwapIcon a="play" b="pause" showB={playing} />}
					onClick={togglePlay}
					disabled={failed}
				/>
				<input
					type="range"
					className={styles.seek}
					min={0}
					max={duration || 0}
					step={0.1}
					value={Math.min(current, duration || 0)}
					onChange={(event) => {
						userTookControl.current = true;
						seekTo(Number(event.target.value));
					}}
					aria-label={labels.seek}
					aria-valuetext={labels.timeOf(formatTime(current), formatTime(duration))}
					disabled={!duration || failed}
					style={{ '--progress': `${progress}%` } as CSSProperties}
				/>
				<span className={styles.time}>
					{formatTime(current)}
					<span className={styles.timeTotal}> / {formatTime(duration)}</span>
				</span>
				<Button
					variant="ghost"
					size="md"
					label={muted ? labels.unmute : labels.mute}
					iconNode={<SwapIcon a="volume" b="volume-off" showB={muted} />}
					onClick={toggleMute}
					disabled={failed}
				/>
				{hasCaptions && (
					<Button variant="ghost" size="md" icon="captions" label={labels.captions} aria-pressed={captionsOn} onClick={toggleCaptions} disabled={failed} className={styles.toggle} />
				)}
				{canFullscreen && (
					<Button
						variant="ghost"
						size="md"
						label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
						iconNode={<SwapIcon a="maximize" b="minimize" showB={fullscreen} />}
						onClick={toggleFullscreen}
					/>
				)}
			</div>
		</div>
	);

	if (!caption) return player;
	return (
		<figure className={cx(styles.figure, className)}>
			{player}
			<figcaption className={styles.caption}>{caption}</figcaption>
		</figure>
	);
}

export default Video;
