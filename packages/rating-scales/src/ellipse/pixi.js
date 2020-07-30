export * from "@pixi/constants";
export * from "@pixi/math";
export * from "@pixi/runner";
export * from "@pixi/settings";
export * from "@pixi/ticker";
import * as utils from "@pixi/utils";
export { utils };
export * from "@pixi/display";
export * from "@pixi/core";
export * from "@pixi/app";
export * from "@pixi/graphics";
import * as interaction from "@pixi/interaction";
export { interaction };

// Renderer plugins
import { Renderer, BatchRenderer } from "@pixi/core";
Renderer.registerPlugin("batch", BatchRenderer);
Renderer.registerPlugin("interaction", interaction.InteractionManager);

// Application plugins
import { Application } from "@pixi/app";
import { TickerPlugin } from "@pixi/ticker";
Application.registerPlugin(TickerPlugin);
