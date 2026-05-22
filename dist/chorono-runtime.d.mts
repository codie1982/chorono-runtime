type ObjectFit = 'fill' | 'contain' | 'cover' | 'none';
interface ImageData {
    assetId: string;
    objectFit?: ObjectFit;
}
interface VideoData {
    assetId: string;
    /** 0–1 playback volume. Default 1. */
    volume?: number;
    /** Mute without losing volume setting. Default false. */
    muted?: boolean;
    /** Trim: offset (ms) into the source file where playback begins. Default 0. */
    startOffsetMs?: number;
    /** Loop the video clip. Default false. */
    loop?: boolean;
}
interface AudioData {
    assetId: string;
    volume?: number;
    muted?: boolean;
    startOffsetMs?: number;
    loop?: boolean;
}
interface FrameSequenceData {
    /** Sprite-sheet image asset id. */
    assetId: string;
    /** Grid columns / rows in the source sheet. */
    columns: number;
    rows: number;
    /** Total frames (≤ columns*rows; last row may be partial). */
    frameCount: number;
    /** Frame cell size in the source sheet (px). */
    frameWidth: number;
    frameHeight: number;
    /** Playback rate (frames per second). */
    fps: number;
    /** Loop when the sequence ends. Default true. */
    loop?: boolean;
    /** How a frame fits the layer size. Default 'contain'. */
    objectFit?: ObjectFit;
}
/**
 * Extended asset types added by the BL-04 universal import pipeline.
 * Legacy code that only uses 'image' | 'video' | 'audio' continues to work
 * because those values are still part of this union.
 */
type AssetType = 'image' | 'video' | 'audio' | 'font' | 'svg' | 'lottie' | 'spriteSheet' | 'gif';
type AssetStorageMode = 'embedded' | 'external' | 'projectPackage' | 'remote';
interface AssetStorage {
    mode: AssetStorageMode;
    /** For 'external' and 'remote' modes */
    uri?: string;
    /** Internal blob ID for embedded data */
    blobId?: string;
    /** Original filename at time of import */
    originalFileName?: string;
}
interface AssetMetadata {
    /** File size in bytes at time of import */
    filesize?: number;
    /** Unix timestamp of when asset was created/imported */
    importedAt?: number;
    /** Source app (e.g. 'figma', 'after-effects', 'blender') */
    sourceApp?: string;
    /** User-defined tags */
    tags?: string[];
    /** Free-form notes */
    notes?: string;
}
interface AssetRuntime {
    /**
     * Blob URL for in-browser display.
     * Created by URL.createObjectURL(), must be revoked when asset is removed.
     * IMPORTANT: NOT stored in scene JSON — stripped by AssetRegistry.serializeAssets().
     */
    objectUrl?: string;
    /**
     * Decoded asset (AudioBuffer, HTMLImageElement, etc.)
     * NOT stored in scene JSON.
     */
    decoded?: unknown;
}
interface Asset {
    id: string;
    name: string;
    type: AssetType;
    /**
     * Primary URL — blob: for in-browser, https: for remote.
     * For persistence, prefer `storage.uri`.
     * Kept for backward compatibility with existing renderer / hooks.
     */
    url: string;
    /** For video / audio only */
    durationMs?: number;
    /** For image / video only */
    width?: number;
    height?: number;
    /** Video frame rate */
    frameRate?: number;
    /** Persistent storage info (not blob URLs). Set by import handlers. */
    storage?: AssetStorage;
    /** Import provenance and user metadata. */
    metadata?: AssetMetadata;
    /**
     * Runtime-only ephemeral data. Stripped before JSON serialization.
     * Use AssetRegistry.serializeAssets() to get a persistence-safe copy.
     */
    runtime?: AssetRuntime;
}

interface AssetCollection {
    id: string;
    name: string;
    color?: string;
    /** IDs of assets in this collection (no duplication of asset objects) */
    assetIds: string[];
}

/**
 * Placeholder for V3 ParticleFlowGraph — stored on ParticleEmitterData.flow.
 * Full definition lands in Sprint P5.
 */
interface ParticleFlowGraphStub {
    _version: 'v3-stub';
}

type ParticleBlendMode = 'normal' | 'screen' | 'additive' | 'multiply';
interface ParticleGlowConfig {
    enabled: boolean;
    radius: number;
    intensity: number;
}
interface ParticleBlurConfig {
    enabled: boolean;
    radius: number;
}
interface ParticleRenderingConfig {
    blendMode: ParticleBlendMode;
    softEdges: boolean;
    glow?: ParticleGlowConfig;
    blur?: ParticleBlurConfig;
    /**
     * 'low'    → skip glow/blur; pixel-level simplifications
     * 'medium' → glow allowed, blur skipped
     * 'high'   → all effects enabled
     */
    quality: 'low' | 'medium' | 'high';
}

interface LifeGradientStop<T> {
    /** Normalized life position 0–1. */
    t: number;
    value: T;
    /** Easing applied from the PREVIOUS stop to this one. */
    easing?: EasingType;
}
interface ParticleLifeGradient<T> {
    stops: LifeGradientStop<T>[];
}
type MotionModifierType = 'noiseDrift' | 'sineWave' | 'spiral';
interface MotionModifierConfig {
    type: MotionModifierType;
    enabled: boolean;
    /** Pixel amplitude of the motion */
    amount?: number;
    /** Cycles per second */
    speed?: number;
    /** Phase offset in radians */
    phase?: number;
}
interface ParticleAnimationConfig {
    lifetimeMs: RangeNumber;
    /** Drift from spawn point over lifetime */
    positionOffset?: {
        x: RangeNumber;
        y: RangeNumber;
        easing?: EasingType;
    };
    /** Scale multiplier over lifetime */
    scaleOverLife?: ParticleLifeGradient<number>;
    /** Opacity over lifetime */
    opacityOverLife?: ParticleLifeGradient<number>;
    /** Angular velocity range (deg/sec) */
    rotationVelocity?: RangeNumber;
    motionModifiers?: MotionModifierConfig[];
}
interface ParticleBurstMarker {
    id: string;
    /** Composition-time position in ms */
    timeMs: number;
    count: number;
    /** Offset added to the master seed — each marker gets a unique distribution */
    seedOffset?: number;
    /** If set, this burst uses a different preset's config */
    presetId?: string;
}

interface RangeNumber {
    min: number;
    max: number;
}
type EmitterMode = 'continuous' | 'burst';
type EmitterShape = 'point' | 'line' | 'circle' | 'rectangle' | 'path' | 'sourceLayer';
interface EmitterArea {
    /** rectangle: half-extents */
    width?: number;
    height?: number;
    /** circle: radius in px */
    radius?: number;
    /** line: endpoints in layer-local coords */
    lineStart?: Vec2;
    lineEnd?: Vec2;
    /** path emitter: id of a sibling bezierPath layer */
    pathLayerId?: string;
    /** sourceLayer emitter: any layer id whose bounds drive the emit area.
     *  The particle layer reads the source's transform.x/y, size, and shape to
     *  sample spawn points. Updated live each frame so animating the source
     *  also moves the emit region. */
    sourceLayerId?: string;
    /** If true, particles spawn on the edge, not inside the area */
    emitFromEdge?: boolean;
}
interface ParticleEmitterConfig {
    mode: EmitterMode;
    shape: EmitterShape;
    /** Continuous mode: particles emitted per second */
    ratePerSecond?: number;
    /** Burst mode: particles per burst */
    burstCount?: number;
    /** Hard cap on simultaneously-alive particles */
    maxParticles: number;
    /** How long the emitter runs (ms). Continuous wraps; burst fires once. */
    durationMs: number;
    loop: boolean;
    /** Delay before first emit (ms) */
    startDelayMs?: number;
    area?: EmitterArea;
}
type ParticleShape = 'circle' | 'softCircle' | 'rect' | 'roundedRect' | 'line' | 'star' | 'triangle' | 'smokePuff' | 'flameBlob';
type ParticleColorMode = 'single' | 'palette' | 'random' | 'gradientOverLife';
interface ParticleStrokeConfig {
    enabled: boolean;
    color: ColorValue;
    width: number;
}
interface ParticleVisualConfig {
    shape: ParticleShape;
    size: RangeNumber;
    colorMode: ParticleColorMode;
    color?: ColorValue;
    palette?: ColorValue[];
    colorOverLife?: ParticleLifeGradient<ColorValue>;
    stroke?: ParticleStrokeConfig;
    /** star: tip count (default 5) */
    starPoints?: number;
    /** star: inner radius / outer radius ratio (default 0.4) */
    starInnerRatio?: number;
}
interface ParticleRandomConfig {
    /** Master seed — same seed = same visual every frame (deterministic) */
    seed: number;
    /** 0–1: spread of initial position from spawn point */
    positionRandomness: number;
    sizeRandomness: number;
    rotationRandomness: number;
    delayRandomness: number;
    lifetimeRandomness: number;
    colorRandomness: number;
}
interface ParticleEmitterData {
    /** 'simple': stateless evaluator (V1). 'flow': ParticleFlowGraph (V3). */
    mode: 'simple' | 'flow';
    emitter: ParticleEmitterConfig;
    particle: ParticleVisualConfig;
    animation: ParticleAnimationConfig;
    random: ParticleRandomConfig;
    rendering: ParticleRenderingConfig;
    /** BurstMarkers extend the timeline with additional on-demand bursts (V2). */
    burstMarkers?: ParticleBurstMarker[];
    /** Flow graph — only when mode === 'flow' (V3). */
    flow?: ParticleFlowGraphStub;
}

/** Timeline-level event marker — fires a runtime action when the playhead
 *  crosses its time. Used by BL-36 Event Track. */
interface TimelineEvent {
    id: string;
    timeMs: number;
    /** Human-readable label shown on the marker. */
    name: string;
    /** Optional payload — wired to the action registry at runtime. */
    payload?: Record<string, unknown>;
}

/** Procedural Track Controllers (BL-50).
 *
 *  Until now every Track was implicitly a "keyframe controller" — its
 *  value at time t was found by interpolating between adjacent kfs in
 *  track.keyframes. With this sprint a Track can opt OUT of keyframes
 *  entirely and source its value from a procedural formula instead.
 *
 *  Two formula types ship today:
 *
 *    waveform  — sine / cosine / square / triangle / sawtooth / reverseSawtooth
 *                with amplitude, frequency, phase, offset, duty.
 *    noise     — deterministic value noise / fbm with seed, frequency,
 *                strength, octaves, lacunarity, gain.
 *
 *  Compound / expression / layered controllers are intentionally deferred
 *  to a later sprint — they need a sandbox + dependency tracking that
 *  goes beyond a single pure formula.
 *
 *  Backward compat: `Track.controller` is OPTIONAL. Undefined → behave
 *  exactly as before (keyframe controller reading track.keyframes).
 *
 *  Pipeline order in evaluator (when controller is non-keyframe):
 *
 *      timeMs  →  resolveOutOfRange       (still honored — cycle/loop
 *                                          works around the formula too)
 *               →  CONTROLLER.sample(t)   (skip keyframe bracket logic)
 *               →  trackModifiers         (BL-46 — clamp/scale/etc. on top)
 *               →  multiplierCurve        (BL-48)
 *               →  final
 *
 *  segmentModifiers are NOT applied because there are no segments —
 *  procedural controllers produce a continuous signal, not a chain of
 *  kf segments.
 */
type WaveformShape = 'sine' | 'cosine' | 'square' | 'triangle' | 'sawtooth' | 'reverseSawtooth';
interface WaveformControllerParams {
    shape: WaveformShape;
    /** Peak-to-trough amplitude. Final output ∈ [offset-amp, offset+amp]. */
    amplitude: number;
    /** Cycles per second. */
    frequency: number;
    /** Phase shift in radians. */
    phase: number;
    /** Constant added to the wave (DC offset). */
    offset: number;
    /** Square wave duty cycle ∈ [0, 1]. Ignored for non-square shapes. */
    duty: number;
}
interface NoiseControllerParams {
    seed: number;
    frequency: number;
    strength: number;
    /** When true, output ∈ [0, strength] instead of [-strength, +strength]. */
    positiveOnly: boolean;
    /** Add a constant baseline (so noise oscillates around offset). */
    offset: number;
    /** Octaves of fBm. 1 = pure value noise. Max 8. */
    octaves: number;
    /** fBm frequency multiplier per octave. */
    lacunarity: number;
    /** fBm amplitude decay per octave. */
    gain: number;
}
type TrackController = {
    type: 'keyframe';
} | {
    type: 'waveform';
    waveform: WaveformControllerParams;
} | {
    type: 'noise';
    noise: NoiseControllerParams;
};

/** Time-Warp / Multiplier / Ease Curves (BL-48).
 *
 *  Three lightweight Bezier-based remappers on the Track level — they
 *  reshape the keyframe pipeline WITHOUT touching keyframe data.
 *
 *  All three use the same shape: a single cubic-bezier defined by two
 *  control points (x1,y1) and (x2,y2) — CSS easing convention. Anchored
 *  at (0,0) → (1,1) implicitly. Easy to store, edit (existing BezierEditor
 *  works), and bake.
 *
 *  Pipeline order in evaluator (when all are set):
 *
 *      timeMs  →  resolveOutOfRange  →  localT = (t-segStart)/dur
 *               →  EASE CURVE       → warpedLocalT = ease(localT)        ← BL-48 (a)
 *               →  TIME WARP        → finalLocalT  = warp(warpedLocalT)  ← BL-48 (b)
 *               →  interpolateKeyframes(kfA, kfB, finalLocalT)
 *               →  MULTIPLIER CURVE → value *= 1 + (mult(localT) - 0.5)*amplitude  ← BL-48 (c)
 *               →  segmentModifiers (BL-46)
 *               →  trackModifiers   (BL-46)
 *               →  final
 *
 *  Why two of (a) + (b)?  In 3ds Max they're separate concepts:
 *    Ease Curve     ≈ "re-time the whole track" — a slow start curve makes
 *                     the WHOLE animation slow at the start.
 *    TimeWarp       ≈ "stretch/squeeze segments" — useful for ramping
 *                     individual sections.
 *  In v1 we treat them as two sequential warp steps; ship both, document
 *  the order, let the user decide.
 */
/** CSS cubic-bezier easing — `cubic-bezier(cx1, cy1, cx2, cy2)`. Endpoints
 *  always (0,0) and (1,1). cx1/cx2 must be in [0,1] to keep the curve
 *  monotone-in-time; cy is unconstrained (overshoot allowed). */
interface BezierTuple {
    cx1: number;
    cy1: number;
    cx2: number;
    cy2: number;
}

/** Curve modifier types and the discriminated-union of modifier kinds
 *  (BL-46). Modifiers are applied AFTER base keyframe interpolation +
 *  AFTER out-of-range resolution; they reshape the value that's about
 *  to be written to the layer property.
 *
 *  See ANIMATION_SIGNAL_SYSTEM.md (BL-46 spec) and the doc this is
 *  derived from. Foundation sprint ships 6 modifier types:
 *
 *    sine | pulse | quantize | offset | scale | clamp
 *
 *  BL-47 will add: wave (square/triangle/saw), noise, fractalNoise, jitter
 *  BL-48 will add: timeWarp
 *  BL-49 will add: bounce, elastic, overshoot, decay, spring
 */
type CurveModifierType = 'sine' | 'pulse' | 'quantize' | 'offset' | 'scale' | 'clamp' | 'wave' | 'noise' | 'fractalNoise' | 'jitter' | 'timeWarp' | 'bounce' | 'elastic' | 'overshoot' | 'decay' | 'spring';
type CurveBlendMode = 'add' | 'multiply' | 'replace' | 'blend';
interface CurveModifier {
    /** Stable id — survives reorder, used as React key + undo target */
    id: string;
    type: CurveModifierType;
    enabled: boolean;
    blendMode: CurveBlendMode;
    /** 0..1 — typical UI slider; values >1 amplify */
    weight: number;
    /** Modifier-specific parameters. Each modifier reads only the keys it
     *  knows about; unknown keys are ignored, missing keys fall back to
     *  defaults defined per modifier type. */
    parameters: Record<string, number | boolean | string>;
}

type EditorMode = '2danimation' | 'video-editor' | 'game-engine' | '3d-modeling';

interface GradientStop {
    /** Position along the gradient axis: 0 (start) → 1 (end) */
    offset: number;
    /** Hex colour string: '#rrggbb' or '#rrggbbaa' */
    color: string;
}
interface GradientFill {
    type: 'linear' | 'radial';
    /** Linear only: 0 = top→bottom, 90 = left→right, 135 = diagonal */
    angle?: number;
    /** At least two stops required for a valid gradient */
    stops: GradientStop[];
}
interface ShapeFill {
    type: 'solid' | 'gradient';
    /** Solid fill colour (hex) */
    color?: string;
    /** Fill opacity 0–100, independent of layer opacity. Default 100. */
    opacity?: number;
    /** Used when type === 'gradient' */
    gradient?: GradientFill;
}
type StrokeAlignment = 'inside' | 'center' | 'outside';
type LineCap = 'butt' | 'round' | 'square';
type LineJoin = 'miter' | 'round' | 'bevel';
/**
 * Trims the visible portion of a stroke path.
 * All values are normalised 0–1 (fraction of total path length).
 *
 * Example — ring progress animation:
 *   start: 0, end: 0→1 (keyframed), offset: 0
 *
 * Example — rotating loader:
 *   start: 0, end: 0.25, offset: 0→1 (keyframed)
 */
interface TrimPathDefinition {
    /** Start of visible segment (0 = path start). Animatable. */
    start: number;
    /** End of visible segment (1 = path end). Animatable. */
    end: number;
    /** Shifts the whole trim window along the path. Animatable. */
    offset: number;
    /**
     * Trim mode:
     *   - 'static'        : start/end are absolute (default — current behavior)
     *   - 'movingSegment' : start/end + offset wrap around path end; use
     *                       segmentLength for a fixed-size window travelling
     *                       along the path (orbiting light, worm trail).
     */
    mode?: 'static' | 'movingSegment';
    /** Length of the visible window in `movingSegment` mode (0–1). */
    segmentLength?: number;
}
interface ShapeStroke {
    color: string;
    /** Stroke thickness in px */
    width: number;
    /** Stroke opacity 0–100. Default 100. */
    opacity?: number;
    /** Where to draw relative to path edge. Default 'center'. */
    alignment?: StrokeAlignment;
    /** Dash pattern, e.g. [] = solid, [8,4] = dashed, [2,4] = dotted */
    dashArray?: number[];
    lineCap?: LineCap;
    lineJoin?: LineJoin;
    /** Optional trim — hides parts of the stroke for reveal / progress animations. */
    trim?: TrimPathDefinition;
    /**
     * Optional gradient stroke. When set, the renderer uses this gradient as
     * the stroke style instead of `color`. Linear gradient uses `angle`,
     * radial uses the shape centre + min(w,h)/2.
     */
    gradient?: GradientFill;
}
interface ShapeStyle {
    /** undefined = no fill (fully transparent background) */
    fill?: ShapeFill;
    /** undefined = no stroke (no border) */
    stroke?: ShapeStroke;
    /** Rect only. 0 = sharp corners. Animatable. */
    cornerRadius?: number;
}

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type FontStyle = 'normal' | 'italic';
type TextAlign = 'left' | 'center' | 'right';
interface TextStroke {
    color: string;
    /** Outline thickness in px. Rendered centered on the glyph edge. */
    width: number;
}
interface TextShadow {
    x: number;
    y: number;
    blur: number;
    /** Hex colour string */
    color: string;
}
interface TextStyle {
    value: string;
    fontSize: number;
    color: string;
    fontFamily?: string;
    fontWeight?: FontWeight;
    fontStyle?: FontStyle;
    textAlign?: TextAlign;
    /** Extra px between characters. Rendered via manual char-by-char draw. */
    letterSpacing?: number;
    /** Line height multiplier. Default 1.2. */
    lineHeight?: number;
    /** Text outline — drawn before fill for correct appearance */
    stroke?: TextStroke;
    /** Drop shadow */
    shadow?: TextShadow;
    /** Transform displayed text to uppercase (stored value unchanged) */
    uppercase?: boolean;
    /** Manual underline drawn via fillRect below the baseline */
    underline?: boolean;
}

interface LayerEffects {
    /** Gaussian blur in px. 0 = no blur. Range 0–50. */
    blur?: number;
    /** Brightness percentage. 100 = normal. Range 0–200. */
    brightness?: number;
    /** Contrast percentage. 100 = normal. Range 0–200. */
    contrast?: number;
    /** Saturation percentage. 100 = normal. Range 0–200. */
    saturate?: number;
}
/**
 * Plugin-based effect (glow, shadow, etc.). Applied AFTER the layer is
 * rendered to an offscreen canvas. See lib/effects/EffectRegistry.ts.
 */
interface PluginEffect {
    id: string;
    type: string;
    enabled: boolean;
    params: Record<string, unknown>;
}
interface MotionBlurConfig {
    enabled: boolean;
    /** Number of trail copies rendered behind the layer (3–12). Default 6. */
    trailCount: number;
    /** ms between each trail step. 0 = auto (1000 / composition.frameRate). */
    frameInterval: number;
    /** Opacity of the nearest trail (0–1). Farthest trail opacity → 0. Default 0.6. */
    maxOpacity: number;
    /** Min px/interval speed to activate trails. Prevents static flicker. Default 0.5. */
    velocityThreshold: number;
    /** When true, real-time evaluation is skipped — bakedGroupId layers are used. */
    baked: boolean;
    /** Id of the group layer containing time-shifted instanceOf trail layers. */
    bakedGroupId?: string;
}
interface MotionPath {
    /** SVG path string, e.g. "M 0 0 C 100 50 200 50 300 0" */
    pathData: string;
    /** When true, rotate layer to align with the path tangent direction */
    autoRotate?: boolean;
}
/**
 * Follow Path binding — drives a target layer's position from a Bezier path
 * layer's geometry. Distinct from MotionPath (which uses an inline SVG path
 * string): FollowPath REFERENCES an existing path layer in the scene, so
 * editing the path updates every follower.
 */
interface FollowPath {
    /** Id of a path-type layer in the scene. */
    pathLayerId: string;
    /** 0–1 arc-length progress along the path. Animatable via the
     *  `followPath.progress` track on the timeline. `assignMotionPathToLayer`
     *  seeds 0 → 1 keyframes on assign so the motion is editable visually. */
    progress?: number;
    /** Rotate the layer to face along the path tangent. */
    orientToPath?: boolean;
    /** Extra rotation added on top of tangent (degrees). */
    rotationOffset?: number;
    /** Perpendicular offset from the path (px). */
    perpendicularOffset?: number;
}

/**
 * A single anchor on a vector path.
 *
 * Each anchor has an on-curve position (x, y) and two optional bezier handles
 * that control the curve entering and leaving the anchor:
 *   - inHandle  → tangent of the segment ARRIVING at this anchor
 *   - outHandle → tangent of the segment LEAVING this anchor
 *
 * Handles are stored in LAYER-LOCAL coordinates (NOT relative to the anchor).
 * If both handles equal the anchor position, the segment becomes a straight line.
 *
 * pointType drives Pen Tool behaviour when dragging handles:
 *   - 'corner'  → handles move independently (sharp corner)
 *   - 'smooth'  → handles stay collinear, lengths independent
 *   - 'mirror'  → handles stay collinear AND equal length
 */
interface PathAnchor {
    x: number;
    y: number;
    /** Incoming bezier handle (controls curve into this anchor). */
    inX?: number;
    inY?: number;
    /** Outgoing bezier handle (controls curve out of this anchor). */
    outX?: number;
    outY?: number;
    /** Handle continuity policy. Default 'corner'. */
    pointType?: 'corner' | 'smooth' | 'mirror';
}
/**
 * A complete vector path: ordered anchors + open/closed flag.
 *
 * When `closed` is true, an additional segment is drawn from the last anchor
 * back to the first one (closing the loop). When false, the path is open
 * (useful for strokes, motion paths).
 */
interface BezierPath {
    anchors: PathAnchor[];
    closed: boolean;
}

type SplinePointType = 'corner' | 'smooth' | 'bezier' | 'bezierCorner';
type SplineSegmentType = 'line' | 'quadratic' | 'cubic';
type SplinePrimitiveKind = 'line' | 'rectangle' | 'roundedRectangle' | 'circle' | 'ellipse' | 'arc' | 'donut' | 'ngon' | 'star' | 'textOutline' | 'spiral' | 'helix' | 'egg' | 'freehand' | 'custom';
type SplineCombineMode = 'add' | 'subtract' | 'intersect' | 'exclude' | 'none';
interface SplinePoint {
    id: string;
    x: number;
    y: number;
    type: SplinePointType;
    locked?: boolean;
}
interface SplineHandle {
    id: string;
    pointId: string;
    kind: 'in' | 'out';
    x: number;
    y: number;
    locked: boolean;
}
interface SplineSegment {
    id: string;
    fromPointId: string;
    toPointId: string;
    type: SplineSegmentType;
    /** Quadratic control point (cubic derives controls from point handles). */
    control1?: {
        x: number;
        y: number;
    };
    control2?: {
        x: number;
        y: number;
    };
}
interface SplineContour {
    id: string;
    closed: boolean;
    pointIds: string[];
    segmentIds: string[];
}
interface LineSplineParams {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
interface RectSplineParams {
    width: number;
    height: number;
    cornerRadius?: number;
    cornerMode?: 'sharp' | 'chamfered' | 'rounded';
}
interface CircleSplineParams {
    radius: number;
}
interface EllipseSplineParams {
    radiusX: number;
    radiusY: number;
}
interface ArcSplineParams {
    radius: number;
    startAngle: number;
    endAngle: number;
}
interface DonutSplineParams {
    outerRadius: number;
    innerRadius: number;
}
interface NGonSplineParams {
    sides: number;
    radius: number;
    roundness?: number;
}
interface StarSplineParams {
    points: number;
    outerRadius: number;
    innerRadius: number;
    roundness?: number;
}
interface SpiralSplineParams {
    turns: number;
    startRadius: number;
    endRadius: number;
    pointsPerTurn?: number;
}
interface HelixSplineParams {
    turns: number;
    startRadius: number;
    endRadius: number;
    pointsPerTurn?: number;
}
interface EggSplineParams {
    width: number;
    height: number;
    factor: number;
}
type SplineGeneratorParams = LineSplineParams | RectSplineParams | CircleSplineParams | EllipseSplineParams | ArcSplineParams | DonutSplineParams | NGonSplineParams | StarSplineParams | SpiralSplineParams | HelixSplineParams | EggSplineParams;
interface SplineSubShape {
    id: string;
    name: string;
    kind: SplinePrimitiveKind;
    source: 'generated' | 'drawn' | 'convertedText' | 'imported' | 'edited';
    contourIds: string[];
    combineMode: SplineCombineMode;
    /** Original creation params; frozen metadata once the sub-shape is edited. */
    generatorParams?: SplineGeneratorParams;
    /** false = parametric (params drive geometry). true = points are canonical. */
    editable: boolean;
}
interface SplinePathData {
    subShapes: Record<string, SplineSubShape>;
    points: Record<string, SplinePoint>;
    handles: Record<string, SplineHandle>;
    segments: Record<string, SplineSegment>;
    contours: Record<string, SplineContour>;
    fillRule: 'nonzero' | 'evenodd';
}

type MaskMode = 'add' | 'subtract' | 'intersect';
interface MaskDefinition {
    id: string;
    /** Layer id whose rendered silhouette is the mask shape. */
    maskLayerId: string;
    /**
     * 'add'       → include any pixel touched by the mask (default)
     * 'subtract'  → exclude pixels touched by the mask
     * 'intersect' → keep only pixels touched by EVERY mask
     */
    mode: MaskMode;
    /** Invert the mask (alpha 0 ↔ 1) before compositing. */
    inverted?: boolean;
    /** Feather radius in px (gaussian blur on the mask). */
    feather?: number;
    /** Mask opacity 0–1. Default 1. */
    opacity?: number;
}

/** Out-of-range (looping) behavior types and interfaces for animation tracks.
 *  Based on 3ds Max conventions: Constant, Cycle, Loop, Ping Pong, Linear, Relative Repeat.
 */
type OutOfRangeType = 'constant' | 'cycle' | 'loop' | 'pingPong' | 'linear' | 'relativeRepeat';
interface OutOfRangeSettings {
    /** Behavior before first keyframe (default: 'constant') */
    before: OutOfRangeType;
    /** Behavior after last keyframe (default: 'constant') */
    after: OutOfRangeType;
    /** Optional: override auto-detected range start (in ms).
     *  If undefined, uses first keyframe time. */
    rangeStartMs?: number;
    /** Optional: override auto-detected range end (in ms).
     *  If undefined, uses last keyframe time. */
    rangeEndMs?: number;
    /** For 'loop' mode: crossfade duration (ms) at seam.
     *  Blends the last frame back to first frame over this duration (default: 0). */
    loopBlendMs?: number;
    /** For 'relativeRepeat': how to offset each cycle.
     *  'valueDelta': add (lastValue - firstValue) per cycle
     *  'velocityDelta': extrapolate velocity at endpoints (default: 'valueDelta') */
    relativeMode?: 'valueDelta' | 'velocityDelta';
}

/**
 * A node in the state machine. The base shape only knows its identity and the
 * side effects to run when it is entered/exited. What the state actually *plays*
 * (a 2D timeline, a 3D blend tree, …) is decided by the extending type.
 */
interface BaseSMState {
    id: string;
    name: string;
    /** Side effects fired when this state becomes active. */
    entryActions?: SMAction[];
    /** Side effects fired when this state is left. */
    exitActions?: SMAction[];
    /** Editor-only node position in the graph canvas (centre point). Optional —
     *  the editor auto-lays-out states that have no stored position. Ignored at
     *  runtime. */
    x?: number;
    y?: number;
}
/**
 * A directed edge between two states.
 *
 * `trigger` is OPTIONAL:
 *   - event-based : trigger set, guard empty   → fire when the event arrives
 *   - guard-only  : trigger empty, guard set   → fire as soon as the guard is
 *                                                 true (checked every frame)
 *   - hybrid      : both set                    → event arrives AND guard true
 *
 * NOTE on naming: this `trigger` (an SM event name like "hover") is unrelated
 * to `TriggerTrack.trigger` in `timeline/tracks.ts` (a timeline input region).
 * They are separate interfaces in separate files — no runtime overlap.
 */
interface BaseSMTransition {
    id: string;
    /** Source state id. `'*'` = wildcard: applies from ANY state. */
    from: string;
    /** Destination state id. */
    to: string;
    /** Event name that fires this transition. Empty → guard-only transition. */
    trigger?: string;
    /** Condition over runtime parameters that must hold for the transition. */
    guard?: SMGuard;
    /** Cross-fade duration when entering `to`. 0 / undefined = hard cut. */
    blendMs?: number;
    /** Higher wins when multiple transitions are eligible at once. Default 0. */
    priority?: number;
}
/** A single comparison over one runtime parameter. */
interface SMGuard {
    param: string;
    op: '>' | '<' | '==' | '!=';
    value: number | string | boolean;
}
/** A side effect run on state entry/exit. */
interface SMAction {
    type: 'setParam' | 'emitEvent';
    /** For `setParam`: which parameter to write. */
    param?: string;
    /** For `setParam`: the value to write. */
    value?: number | string | boolean;
    /** For `emitEvent`: the event name to emit back into the machine/host. */
    event?: string;
}

/**
 * A Chrono state plays one timeline while active.
 * `timelineId` references `ChronoScene.timelines[].id`.
 */
interface ChronoSMState extends BaseSMState {
    /** Which timeline plays while this state is active. */
    timelineId: string;
    /** Playback rate multiplier for this state's timeline. Default 1. */
    speed?: number;
}
/**
 * A complete state machine attached to a scene. Drives which timeline is the
 * active playhead and how transitions blend between them.
 */
interface StateMachineDefinition {
    id: string;
    name: string;
    /** State that is active when the machine starts. */
    initialStateId: string;
    states: ChronoSMState[];
    transitions: BaseSMTransition[];
}

type LayerType = 'shape' | 'text' | 'image' | 'video' | 'audio' | 'frameSequence' | 'pathStroke' | 'path' | 'spline' | 'group' | 'repeater' | 'particleEmitter';
type ShapeType = 'rect' | 'circle';
/** Extended shape kinds. Existing 'rect'/'circle' kept for backward compat via ShapeType. */
type ShapeKind = 'rect' | 'ellipse' | 'line' | 'arrow' | 'polygon' | 'star' | 'ring' | 'arc' | 'capsule' | 'spiral' | 'wave' | 'blob';
/** Shape-specific geometry parameters. All fields optional — defaults live in renderer/factory. */
interface ShapeParams {
    kind: ShapeKind;
    /** polygon: edge count (3–12). star: point count (3–12). blob: vertex count (5–64). */
    sides?: number;
    /** star: inner arm radius (px). ring: hole radius (px). */
    innerRadius?: number;
    /** star: outer tip radius (px). Falls back to min(width,height)/2. */
    outerRadius?: number;
    /** polygon/star corner roundness 0–1. */
    roundness?: number;
    /** ring/arc: start angle in degrees (0 = 12 o'clock). */
    startAngle?: number;
    /** ring/arc: end angle in degrees. */
    endAngle?: number;
    /** line/arrow: endpoint X in layer-local coordinates. */
    x2?: number;
    /** line/arrow: endpoint Y in layer-local coordinates. */
    y2?: number;
    /** arrow: arrowhead length in px. */
    arrowHeadSize?: number;
    /** spiral: turn count (default 3, min 0.5, max 20). */
    turns?: number;
    /** spiral: starting radius from center in px (default 4). */
    startRadius?: number;
    /** spiral: ending radius from center in px (default min(w,h)/2). */
    endRadius?: number;
    /** spiral: radius interpolation exponent (1=linear, <1 looser outer, >1 tighter inner). */
    tightness?: number;
    /** wave: peak amplitude in px (default h/4). */
    amplitude?: number;
    /** wave: full cycle count across width (default 2, min 0.1, max 50). */
    frequency?: number;
    /** wave: phase offset in radians (default 0, animatable). */
    phase?: number;
    /** blob: noise ratio 0–1 (default 0.4). */
    irregularity?: number;
    /** blob: deterministic seed integer (default 42). NOT animatable — would jump per frame. */
    seed?: number;
}
/** Colour as four 0–255 channels — used for animated colour values */
interface ColorValue {
    r: number;
    g: number;
    b: number;
    a: number;
}
/** 2D vector — used for animated position values */
interface Vec2 {
    x: number;
    y: number;
}
type AnimatableValue = number | boolean | string | ColorValue | Vec2;
type EasingType = 'linear' | 'hold' | 'easeIn' | 'easeOut' | 'easeInOut' | 'customBezier';
interface EasingDefinition {
    type: EasingType;
    /** Only used when type === 'customBezier' */
    bezier?: {
        cx1: number;
        cy1: number;
        cx2: number;
        cy2: number;
    };
}
/**
 * How the in / out bezier handles of a customBezier easing behave when one
 * of them is dragged.
 *   • broken  — handles are fully independent (default; what we shipped first)
 *   • aligned — dragging one handle mirrors the other across the keyframe so
 *               the curve passes through smoothly (continuous tangent)
 *   • auto    — handles are computed from neighbouring keyframes — user
 *               doesn't edit them at all. (Sprint 3 reserves the field but
 *               the auto-tangent solver lands in a later sprint.)
 *   • linear  — segment renders as a straight line; bezier handles ignored
 *
 * Stored per-keyframe so different segments can have different curve
 * characters in the same track.
 */
type TangentMode = 'broken' | 'aligned' | 'auto' | 'linear';
interface Keyframe {
    /** Stable UUID — identity key that survives timeMs changes during drag */
    id: string;
    timeMs: number;
    value: AnimatableValue;
    easing: EasingDefinition;
    /** Bezier-handle linkage mode. Defaults to 'broken' when undefined. */
    tangentMode?: TangentMode;
    /** BL-46 — modifiers scoped to the segment from THIS keyframe to the
     *  NEXT keyframe in time. Empty / undefined = no modifiers on this
     *  segment. The last keyframe's segmentModifiers is unused (no next
     *  segment exists). Stored on the leading kf rather than as a separate
     *  KeyframeSegment entity so kf delete naturally removes the segment. */
    segmentModifiers?: CurveModifier[];
}
interface Track {
    /** e.g. "layers.card.opacity" | "layers.card.transform.x" */
    target: string;
    label?: string;
    keyframes: Keyframe[];
    /** Track-kind discriminator (BL-35). Optional for backward compat:
     *  legacy tracks without a `kind` are treated as 'property'. See
     *  `src/lib/timeline/tracks.ts` for the full union (event / audio /
     *  marker / state / trigger track types). */
    kind?: 'property';
    /** Out-of-range behavior (BL-45). Defines what happens before first keyframe
     *  and after last keyframe (Constant, Cycle, Loop, PingPong, Linear, RelativeRepeat).
     *  Optional for backward compat: undefined defaults to constant/constant. */
    outOfRange?: OutOfRangeSettings;
    /** BL-46 — modifiers scoped to the WHOLE track. Applied AFTER keyframe
     *  interpolation, AFTER out-of-range resolution, AFTER segment-scoped
     *  modifiers. Use for "noise on the whole rotation track" or "clamp
     *  opacity to [0,1] no matter what the upstream is producing". */
    modifiers?: CurveModifier[];
    /** BL-48 — Ease Curve: re-times the whole track via a cubic-bezier.
     *  Applied to localT BEFORE keyframe interpolation. A slow-start curve
     *  makes the entire animation appear to start slow. */
    easeCurve?: BezierTuple;
    /** BL-48 — TimeWarp: secondary time remap applied AFTER easeCurve.
     *  Composes with easeCurve as `timeWarp(easeCurve(localT))`. Lets the
     *  user stack two layers of timing control (e.g., master ease + per-
     *  section warp without disturbing each other). */
    timeWarp?: BezierTuple;
    /** BL-48 — Multiplier Curve: scales the post-modifier value by a
     *  bezier sampled at localT. `multiplierAmplitude` (default 1) controls
     *  how much the curve influences the value:
     *      value' = value * (1 + (bezier(localT) - 0.5) * amplitude * 2)
     *  Amplitude 0 = no effect; 1 = bezier ∈ [0,1] becomes scale ∈ [0,2]. */
    multiplierCurve?: BezierTuple;
    multiplierAmplitude?: number;
    /** BL-50 — Procedural controller. When set, the track ignores its
     *  `keyframes` array and sources value from a formula (waveform / noise).
     *  Backward compat: undefined → keyframe controller (existing behavior).
     *  Track modifiers + multiplier curve + out-of-range still apply on top
     *  of the procedural output. */
    controller?: TrackController;
}
interface TimelineMarker {
    id: string;
    timeMs: number;
    label: string;
    color?: string;
    type?: 'note' | 'beat' | 'scene' | 'export' | 'warning';
}
interface TimelineSegment {
    id: string;
    name: string;
    startMs: number;
    endMs: number;
    color?: string;
}
interface Timeline {
    id: string;
    durationMs: number;
    /** Mode discriminant. Always '2danimation' for this type.
     *  Optional for backward compat — existing scene JSON without this field
     *  is implicitly '2danimation'. */
    mode?: '2danimation';
    autoplay: boolean;
    loop: boolean;
    /** 0 = infinite, N = play N times. Default 0. */
    loopCount?: number;
    /** Play forward then backward. Default false. */
    pingPong?: boolean;
    tracks: Track[];
    workAreaInMs?: number;
    workAreaOutMs?: number;
    markers?: TimelineMarker[];
    segments?: TimelineSegment[];
    /** BL-36 — discrete event markers fired when the playhead crosses them
     *  (e.g. playSound, emitParticles, openModal). Imported via the AnyTrack
     *  union when displayed but stored separately so existing scene data
     *  doesn't need migration. */
    events?: TimelineEvent[];
    /** Explicit list of layer IDs that appear in this timeline's track view.
     * undefined = legacy / "show all layers" (backward compat).
     * [] = new timeline with no layers yet; layers must be dragged in. */
    layerIds?: string[];
}
interface Transform {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotationDeg: number;
    /** Pivot X for rotation and scale. Static — NOT animatable. */
    anchorX: number;
    /** Pivot Y for rotation and scale. Static — NOT animatable. */
    anchorY: number;
}
interface Layer {
    id: string;
    /** Human-friendly display name, e.g. "Logo", "Background" */
    name: string;
    /** Mode discriminant. Always '2danimation' for this type.
     *  Optional for backward compat — existing scene JSON without this field
     *  is implicitly '2danimation'. */
    mode?: '2danimation';
    type: LayerType;
    /** Legacy shape discriminator kept for backward compat. Prefer shapeKind for new shapes. */
    shape?: ShapeType;
    /** Extended shape kind — used for all shapes beyond 'rect' and 'circle'. */
    shapeKind?: ShapeKind;
    /** Shape-specific geometry parameters (sides, radii, angles, endpoints…). */
    shapeParams?: ShapeParams;
    /** Bezier path data — used when type === 'path'. Editable via Pen Tool. */
    path?: BezierPath;
    /** Spline object data — used when type === 'spline'. Holds SubShapes + contours. */
    spline?: SplinePathData;
    /**
     * Visual vs motion guide path. Defaults to 'visual' when type === 'path'.
     * Motion paths are not rendered as visible strokes during playback — they
     * exist purely to drive `followPath` on other layers.
     */
    pathRole?: 'visual' | 'motion';
    /** Pivot for rotation/scale — set once in PropertiesPanel, NOT keyframed */
    transform: Transform;
    opacity: number;
    /** Canvas composite operation. Default 'source-over'. */
    blendMode?: GlobalCompositeOperation;
    style?: ShapeStyle;
    size?: {
        width: number;
        height: number;
    };
    text?: TextStyle;
    image?: ImageData;
    video?: VideoData;
    audio?: AudioData;
    /** Sprite-sheet / frame-sequence animation — used when type === 'frameSequence'. */
    frameSequence?: FrameSequenceData;
    effects?: LayerEffects;
    /** Plugin-based effect chain (glow/shadow/etc.) applied AFTER rendering. */
    effectsChain?: PluginEffect[];
    /** Temporal trail effect driven by layer velocity. See renderMotionBlurTrails. */
    motionBlur?: MotionBlurConfig;
    motionPath?: MotionPath;
    /** Drives layer position from another path layer's geometry. */
    followPath?: FollowPath;
    /** When layer becomes active. Default 0. */
    startMs?: number;
    /** When layer deactivates. Default timeline.durationMs. */
    endMs?: number;
    pathStroke?: PathStrokeData;
    /** Parent group layer id. undefined / null = root layer. */
    parentId?: string;
    /** Group masks: ids of layers to be used as masks on THIS layer. */
    masks?: MaskDefinition[];
    /** Repeater config — only used when type === 'repeater'. */
    repeater?: RepeaterLayerData;
    /** Particle emitter config — only used when type === 'particleEmitter'. */
    particleEmitter?: ParticleEmitterData;
    /** When true, runtime hit-testing will fire 'click' triggers on this layer. */
    tappable?: boolean;
    /** Map of property dot-paths → parameter id. Resolved at evaluation time. */
    paramBindings?: Record<string, string>;
    /**
     * When true, pointerdown on this layer in preview mode starts a drag —
     * fires dragStart / dragMove / dragEnd trigger events. Progress (0-1) is
     * computed from the drag delta vs dragRange.
     */
    draggable?: boolean;
    /** Drag config — only used when draggable: true. */
    dragConfig?: DragConfig;
    internalGrid?: {
        size: number;
    };
    locked?: boolean;
    hidden?: boolean;
    solo?: boolean;
    /** Pinned layers stick to the top of the timeline list, scroll-independent.
     *  Useful for keeping a controller / camera / master layer always visible. */
    pinned?: boolean;
    colorLabel?: string;
    /** BL-55 — 3ds Max-style freeze: layer remains visible on canvas but is
     *  not selectable, not editable, and rendered translucent. Different from
     *  `locked` (which keeps the layer fully opaque + selectable for inspection). */
    frozen?: boolean;
    /**
     * BL-59 Phase 3 — Live instance reference. When set, this layer is a
     * THIN reference to another layer (the source):
     *   - Geometry / style / size / text / image / path / etc. come from the
     *     source at RENDER time (so source edits propagate live).
     *   - Transform / opacity / parentId / effects / id / name stay on THIS
     *     layer (each instance can sit anywhere with its own opacity).
     *
     * Instance layers have no shape / path / size of their own — those
     * fields are deliberately stripped at creation time (CloneSingleLayer
     * with mode='instance'). Resolution lives in
     * `src/lib/clone/InstanceResolver.ts`.
     *
     * If the source is missing (deleted), the renderer skips the instance
     * and bbox/hit-test treat it as empty.
     */
    instanceOf?: string;
}
type SceneParameterType = 'string' | 'number' | 'boolean' | 'color' | 'image';
type SceneParameterValue = string | number | boolean;
interface SceneParameter {
    id: string;
    name: string;
    type: SceneParameterType;
    defaultValue: SceneParameterValue;
    /** Optional min/max for number params (drives preview slider range). */
    min?: number;
    max?: number;
}
type PathShapeType = 'ellipse' | 'circle' | 'rect' | 'custom';
type StrokeCap = 'butt' | 'round' | 'square';
type PathTrimMode = 'static' | 'movingSegment';
interface PathStrokeDefinition {
    shapeType: PathShapeType;
    /** For ellipse / rect / circle (= width=height). Required for those shapes. */
    width?: number;
    height?: number;
    /** For shapeType === 'custom': SVG path string. */
    customPath?: string;
}
interface PathStrokeGlow {
    color: string;
    blur: number;
}
interface PathStrokeStyle {
    color: string;
    width: number;
    cap?: StrokeCap;
    glow?: PathStrokeGlow;
}
interface PathTrim {
    mode: PathTrimMode;
    /** 0–1: visible segment length as a fraction of total path. Default 0.2. */
    segmentLength?: number;
    /** 0–1: animated. Track this via 'layers.<id>.pathStroke.trim.offset'. */
    offset: number;
}
interface PathStrokeData {
    path: PathStrokeDefinition;
    stroke: PathStrokeStyle;
    trim: PathTrim;
}
type DragAxis = 'x' | 'y' | 'both';
interface DragConfig {
    /** Which axes contribute to the progress value. Default 'both'. */
    axis?: DragAxis;
    /**
     * Max drag distance (px) at which progress = 1. Default 200.
     * For axis='both', uses Math.hypot(dx, dy).
     */
    range?: number;
    /**
     * When true, the dragged layer's transform.x/y follows the cursor during
     * drag (visual slider/knob feedback). Constrained to axis.
     * Default false (events fire but layer stays still).
     */
    followCursor?: boolean;
    /**
     * Parameter id to set with normalized progress (0-1) on every dragMove.
     * Lets the drag DIRECTLY drive a scene parameter without needing a trigger.
     * Optional — when set, the parameter is updated automatically.
     */
    setsParameter?: string;
    /**
     * Timeline id whose playhead is driven by the drag.
     *
     * Each dragMove sets `currentTime = progress * timeline.durationMs`, so
     * every keyframe on that timeline scrubs in sync with the drag. Use this
     * to build "scrub-controlled" interactions:
     *   "Drag this box down → text blur ramps up" — animate blur on Timeline 1,
     *   then point the box's scrubsTimeline at Timeline 1.
     */
    scrubsTimeline?: string;
}
type RepeaterMode = 'linear' | 'polar';
interface RepeaterTransformStep {
    x?: number;
    y?: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    opacity?: number;
}
interface RepeaterPolarParams {
    radius: number;
    startAngle: number;
    endAngle: number;
    orientToAngle?: boolean;
}
interface RepeaterLayerData {
    /** Layer id whose visual is being repeated. */
    sourceLayerId: string;
    count: number;
    mode: RepeaterMode;
    transformStep?: RepeaterTransformStep;
    polar?: RepeaterPolarParams;
}
type TriggerEventType = 'click' | 'dragStart' | 'dragMove' | 'dragEnd' | 'animationStart' | 'animationComplete' | 'animationLoop' | 'segmentStart' | 'segmentComplete' | 'layerAppear' | 'layerDisappear' | 'layerAnimationComplete' | 'markerReached' | 'frameReached' | 'customEvent';
interface TriggerEvent {
    type: TriggerEventType;
    /** For click / drag / layer* / layerClick: which layer. */
    layerId?: string;
    /** For segmentStart / segmentComplete: which segment. */
    segmentId?: string;
    /** For animation* events: which timeline. */
    timelineId?: string;
    /** For markerReached: marker id. For customEvent: event name. */
    refId?: string;
    /** For frameReached: zero-based frame index inside the active timeline. */
    frameNumber?: number;
}
type TriggerConditionOp = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte';
interface TriggerCondition {
    /** Dot-path into runtime state, e.g. 'params.score'. */
    path: string;
    op: TriggerConditionOp;
    value: number | boolean | string;
}
type TriggerActionType = 'play' | 'pause' | 'stop' | 'reverse' | 'seek' | 'playSegment' | 'setParam' | 'emitEvent';
/**
 * For setParam actions, a dynamic value source pulled from the firing
 * RuntimeEvent's payload (drag deltas + progress). When set, overrides the
 * static `paramValue`. Lets drag events drive scene parameters declaratively.
 */
type ParamValueSource = 'event.progress' | 'event.dx' | 'event.dy';
interface TriggerAction {
    type: TriggerActionType;
    timelineId?: string;
    /** For seek: target time in ms. */
    timeMs?: number;
    /** For playSegment: target segment id. */
    segmentId?: string;
    /** For playSegment: optional loop flag (default false). */
    loop?: boolean;
    /** For setParam: target parameter id. */
    paramId?: string;
    /** For setParam: STATIC value to write. Used when paramValueFrom is unset. */
    paramValue?: SceneParameterValue;
    /**
     * For setParam: DYNAMIC value source — reads from the firing event's data.
     *   'event.progress' — drag progress 0–1 (dragMove)
     *   'event.dx'       — raw horizontal drag delta in composition px
     *   'event.dy'       — raw vertical drag delta
     * When set, takes priority over `paramValue`.
     */
    paramValueFrom?: ParamValueSource;
    /** For emitEvent: custom event name to emit. */
    eventName?: string;
}
interface Trigger {
    id: string;
    /** Optional human label shown in Events panel. */
    label?: string;
    event: TriggerEvent;
    condition?: TriggerCondition;
    actions: TriggerAction[];
}
type BindingSourceType = 'layerProperty' | 'parameter';
type BindingTargetType = 'layerProperty' | 'timelineProgress' | 'parameter';
interface BindingSource {
    type: BindingSourceType;
    layerId?: string;
    /** Dot-path e.g. 'transform.x', 'opacity', 'style.fill.color'. */
    property?: string;
    paramId?: string;
}
interface BindingTarget {
    type: BindingTargetType;
    layerId?: string;
    property?: string;
    timelineId?: string;
    paramId?: string;
}
interface BindingMap {
    inputMin: number;
    inputMax: number;
    outputMin: number;
    outputMax: number;
    /** Clamp output to [outputMin, outputMax]. Default true. */
    clamp?: boolean;
    /** Reverse the mapping (outputMax becomes the low end). Default false. */
    reverse?: boolean;
}
interface Binding {
    id: string;
    source: BindingSource;
    target: BindingTarget;
    map: BindingMap;
}
type ParameterValueType = 'number' | 'boolean' | 'string' | 'color' | 'vec2';
interface ParameterRef {
    /** Layer this property belongs to. Absent → top-level scene parameter. */
    layerId?: string;
    /** Modifier instance within a layer (reserved for future modifier wiring). */
    modifierId?: string;
    /** Dot-path within the layer/modifier (e.g. "transform.rotationDeg", "opacity"),
     *  or — for scene parameters — the parameter id alone. */
    propertyPath: string;
    /** Coarse type of the referenced value. Drives picker filtering + UI labels. */
    valueType: ParameterValueType;
}
interface ParameterWireClamp {
    enabled: boolean;
    min?: number;
    max?: number;
}
interface ParameterWire {
    id: string;
    /** Optional user-given name; falls back to formatParameterRef(source→target). */
    name?: string;
    enabled: boolean;
    source: ParameterRef;
    target: ParameterRef;
    /** Whitelist-only expression evaluated each frame with `source` bound to the
     *  source value. See src/lib/core/expression/expressionEvaluator.ts. */
    expression: string;
    /** Replacement semantics. 'override' (default) writes the result outright;
     *  'add' will be the additive sum once multi-wire blending lands. MVP only
     *  uses 'override'. */
    blendMode: 'override' | 'add';
    /** Optional output clamp — applied AFTER the expression evaluates. */
    clamp?: ParameterWireClamp;
    /** Epoch ms timestamps for sorting + audit. */
    createdAt: number;
    updatedAt: number;
}
interface Composition {
    id: string;
    width: number;
    height: number;
    durationMs: number;
    frameRate: number;
    backgroundColor: string;
}
interface ChronoScene {
    formatVersion: '1.0.0';
    /** Mode discriminant. Identifies this as a 2D animation scene.
     *  Optional for backward compat — existing JSON without this field is
     *  implicitly '2danimation'. Future modes produce their own scene types. */
    mode?: EditorMode;
    composition: Composition;
    assets: Asset[];
    /** Asset collections (folders) for organizing imported materials.
     *  Optional for backward compat — legacy scenes without this field
     *  treat all assets as uncategorized. Added by BL-04 import pipeline. */
    assetCollections?: AssetCollection[];
    layers: Layer[];
    timelines: Timeline[];
    /** Runtime-tunable parameters. Surfaced via setParam() on the host platform. */
    parameters: SceneParameter[];
    triggers: Trigger[];
    bindings: Binding[];
    /** Expression-based parameter wires (BL-05). Optional for backward compat;
     *  legacy scenes without this field continue to work unchanged. */
    parameterWires?: ParameterWire[];
    /** Interactive state machines (BL-09). Each state binds to a timeline;
     *  transitions switch the active playhead. Optional for backward compat. */
    stateMachines?: StateMachineDefinition[];
    initialState: Record<string, unknown>;
}

/** Evaluate all timelines and return a map of property path → computed value. */
type OverrideMap = Map<string, number>;

type ParamValueMap = Map<string, SceneParameterValue>;

/** Element cache passed in from React (image / video DOM elements keyed by Asset.id). */
type AssetElementMap = Map<string, HTMLImageElement | HTMLVideoElement>;

type RuntimeValue = string | number | boolean;

/** Reads the current value of a runtime parameter by name. */
type ParamLookup = (name: string) => RuntimeValue | undefined;

/** Public blend snapshot for a given wall time. */
interface ActiveBlend {
    fromTimelineId: string;
    toTimelineId: string;
    /** 0 → fully from, 1 → fully to. */
    alpha: number;
}
declare class StateMachineRuntime {
    sm: StateMachineDefinition;
    currentStateId: string;
    private blend;
    constructor(sm: StateMachineDefinition);
    /**
     * Adopt an updated definition (the editor produces a new object on every
     * edit). Preserves the live `currentStateId` when that state still exists;
     * otherwise snaps back to the new initial state. The blend is left intact —
     * an in-flight cross-fade survives an unrelated edit.
     */
    sync(def: StateMachineDefinition): void;
    get currentState(): ChronoSMState | undefined;
    /** Timeline that should play right now (the current state's timeline). */
    get activeTimelineId(): string | null;
    /** True when `timelineId` backs any state of this machine. */
    ownsTimeline(timelineId: string): boolean;
    /**
     * Try to fire a transition for the given event. Returns the actions to run
     * (exit actions of the old state followed by entry actions of the new one),
     * or an empty array when nothing fires.
     */
    dispatch(event: string, getParam: ParamLookup, wallMs: number): SMAction[];
    /**
     * Check guard-only transitions (those without a trigger) and auto-fire the
     * winning one. Called every frame so parameter thresholds switch states with
     * no explicit event.
     */
    tickGuards(getParam: ParamLookup, wallMs: number): SMAction[];
    private applyTransition;
    /**
     * The in-flight blend for `wallMs`, or null when not blending. Self-clears
     * once the blend duration elapses so the host falls back to playing only the
     * active timeline.
     */
    getBlend(wallMs: number): ActiveBlend | null;
    /**
     * Non-mutating blend snapshot for UI display — unlike getBlend() it never
     * clears the blend, so the editor can read progress without interfering with
     * the runtime's own frame ticking.
     */
    peekBlend(wallMs: number): ActiveBlend | null;
    /** Reset to the initial state and clear any blend. */
    reset(): void;
}

interface RuntimeEvent {
    type: TriggerEventType;
    layerId?: string;
    segmentId?: string;
    timelineId?: string;
    refId?: string;
    frameNumber?: number;
    /** 0–1 normalized drag distance, used for dragMove. */
    progress?: number;
    /** Raw horizontal drag delta in composition pixels (dragMove). */
    dx?: number;
    /** Raw vertical drag delta in composition pixels (dragMove). */
    dy?: number;
}
type ResolvedAction = TriggerAction & {
    triggerId: string;
    /** The event that fired this action — provides dx/dy/progress payload for
     *  paramValueFrom resolution downstream. */
    sourceEvent: RuntimeEvent;
};

interface SegmentPlaybackState {
    segmentId: string;
    timelineId: string;
    startMs: number;
    endMs: number;
    loop: boolean;
    /** `performance.now()` (or any monotonic ms clock) at the moment play() was called. */
    startWallTimeMs: number;
}

interface RenderFrame {
    scene: ChronoScene;
    timeMs: number;
    overrides: OverrideMap;
    paramValues: ParamValueMap;
    assets: AssetElementMap;
}
declare abstract class RenderAdapter {
    /** Draw one fully-evaluated frame. */
    abstract render(frame: RenderFrame): void;
}
/**
 * Web adapter — renders to a 2D canvas using the shared CanvasRenderer in
 * preview mode (no editor chrome). Identical output to the editor viewport.
 */
declare class CanvasRenderAdapter extends RenderAdapter {
    private _ctx;
    constructor(ctx: CanvasRenderingContext2D);
    get ctx(): CanvasRenderingContext2D;
    render(frame: RenderFrame): void;
}

interface ChronoPlayerOptions {
    /** DOM elements (images/video) keyed by Asset.id. Default empty. */
    assets?: AssetElementMap;
    /** Loop the global timeline at composition.durationMs. Default true. */
    loop?: boolean;
}
interface FrameResult {
    overrides: OverrideMap;
    paramValues: ParamValueMap;
    events: RuntimeEvent[];
    actions: ResolvedAction[];
    segmentState: SegmentPlaybackState | null;
}
declare class ChronoPlayer {
    private _scene;
    private _assets;
    private _adapter;
    private _events;
    private _smRuntimes;
    private _eventQueue;
    private _smEventQueue;
    private _paramOverrides;
    private _segment;
    private _prevSnapshot;
    private _playing;
    private _loop;
    private _startWall;
    private _offsetMs;
    private _rafId;
    constructor(scene: ChronoScene, adapter?: RenderAdapter | null, opts?: ChronoPlayerOptions);
    load(scene: ChronoScene, assets?: AssetElementMap): void;
    setAdapter(adapter: RenderAdapter): void;
    get currentTimeMs(): number;
    get isPlaying(): boolean;
    get smRuntimes(): Map<string, StateMachineRuntime>;
    on(type: TriggerEventType, listener: (event: RuntimeEvent) => void): () => void;
    onAny(listener: (event: RuntimeEvent) => void): () => void;
    /** Queue an external runtime event (click, drag, customEvent). */
    fireEvent(event: RuntimeEvent): void;
    /** Dispatch a state-machine event by name. Broadcast when smId omitted. */
    dispatch(event: string, smId?: string): void;
    /** Override a scene parameter (e.g. host-supplied value). */
    setParam(name: string, value: SceneParameterValue): void;
    resetParams(): void;
    playSegment(timelineId: string, segmentId: string, loop?: boolean): void;
    stopSegment(): void;
    play(): void;
    pause(): void;
    stop(): void;
    seek(timeMs: number): void;
    /** Tear down clock + listeners. */
    destroy(): void;
    tick(globalTimeMs: number): FrameResult;
    /** Port of useSMRuntime.tickFrame — no React, same blend logic. */
    private _tickStateMachines;
    private _applyAction;
    private _clockTimeMs;
    private _startRaf;
    private _stopRaf;
}

type EventListener = (event: RuntimeEvent) => void;
declare class EventBridge {
    private byType;
    private anyListeners;
    /** Subscribe to a single event type. Returns an unsubscribe function. */
    on(type: TriggerEventType, listener: EventListener): () => void;
    /** Subscribe to every emitted event. Returns an unsubscribe function. */
    onAny(listener: EventListener): () => void;
    /** Emit one event to type-specific and catch-all listeners. */
    emit(event: RuntimeEvent): void;
    /** Emit a batch (per-frame lifecycle + external events). */
    emitAll(events: RuntimeEvent[]): void;
    /** Drop all subscriptions (player teardown). */
    clear(): void;
}

/**
 * Build or update StateMachineRuntime instances to match the scene's machine
 * definitions. Passing the previous map preserves live currentState across a
 * reload while picking up structural changes.
 */
declare function reconcileStateMachines(scene: ChronoScene, existing?: Map<string, StateMachineRuntime>): Map<string, StateMachineRuntime>;

export { CanvasRenderAdapter, ChronoPlayer, type ChronoPlayerOptions, EventBridge, type FrameResult, RenderAdapter, type RenderFrame, reconcileStateMachines };
