import type { StageProps } from '@stageshow';

/** The six steps of Our Process, in order. */
export const PROCESS_STEPS = ['discover', 'define', 'design', 'develop', 'integrate', 'launch'] as const;
export type ProcessStep = (typeof PROCESS_STEPS)[number];
export const isProcessStep = (key: string): key is ProcessStep => (PROCESS_STEPS as readonly string[]).includes(key);

/** Every scene is drawn at the Process Card tile's own size (Figma 342 × 160), shown 1:1. */
export const SCENE_WIDTH = 342;
export const SCENE_HEIGHT = 160;

/** The classic arrow, with a soft ring on each click so a press reads at tile size. */
export const sceneCursor = (at: NonNullable<StageProps<object>['cursor']>['at']): NonNullable<StageProps<object>['cursor']> => ({
	at,
	style: 'yeta',
	ripple: true,
});

/** The words each scene shows, from messages `ourProcess.scenes.<step>`. */
export type SceneCopy = {
	discover: { doc: string; quote: string; tag: string };
	define: { doc: string; draft: string; approved: string };
	design: { frame: string; radius: string };
	develop: { file: string; line: string; command: string; building: string; passed: string };
	integrate: { connect: string; connected: string };
	launch: { env: string; building: string; ready: string; url: string };
};
