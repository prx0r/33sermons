import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

const StingerText: React.FC<{
  text: string;
  startFrame: number;
  duration: number;
  fontSize?: number;
  color?: string;
  x?: number;
  y?: number;
  align?: CanvasTextAlign;
}> = ({ text, startFrame, duration, fontSize = 56, color = "#FFFFFF", x = 540, y = 960, align = "center" }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, 4, duration - 4, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const scale = interpolate(local, [0, 6], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize,
        color,
        textAlign: align,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

const PulseBar: React.FC<{
  startFrame: number;
  duration: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}> = ({ startFrame, duration, color, x, y, width, height }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, 4, duration - 4, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const w = interpolate(local, [0, 10, duration - 10, duration], [0, width, width, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y,
        width: w,
        height,
        backgroundColor: color,
        opacity: opacity * 0.8,
        borderRadius: 2,
      }}
    />
  );
};

const DualText: React.FC<{
  leftText: string;
  rightText: string;
  startFrame: number;
  duration: number;
}> = ({ leftText, rightText, startFrame, duration }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, 5, duration - 5, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideL = interpolate(local, [0, 8], [-60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slideR = interpolate(local, [0, 8], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", width: "100%", top: "50%", transform: "translateY(-50%)", opacity }}>
      <div
        style={{
          position: "absolute",
          left: "15%",
          transform: `translateX(${slideL}px)`,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 40,
          color: "#666",
        }}
      >
        {leftText}
      </div>
      <div
        style={{
          position: "absolute",
          right: "15%",
          transform: `translateX(${slideR * -1}px)`,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 40,
          color: "#FFF",
          textAlign: "right",
        }}
      >
        {rightText}
      </div>
    </div>
  );
};

export const Concept3: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D0D0D",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0D0D0D 0%, #1A0A0A 50%, #0D0D0D 100%)",
        }}
      />

      <Sequence from={0} durationInFrames={120}>
        <StingerText
          text="Relief is not freedom."
          startFrame={0}
          duration={120}
          fontSize={72}
          color="#FF4444"
          y={800}
        />
      </Sequence>

      <Sequence from={120} durationInFrames={150}>
        <StingerText
          text="Choosing relief"
          startFrame={120}
          duration={150}
          fontSize={48}
          color="#FFFFFF"
          y={800}
        />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <StingerText
          text="is choosing to perpetuate the cycle."
          startFrame={180}
          duration={90}
          fontSize={40}
          color="#FF6666"
          y={880}
        />
      </Sequence>

      <Sequence from={270} durationInFrames={120}>
        <PulseBar startFrame={270} duration={120} color="#FF4444" x={540} y={800} width={200} height={3} />
        <StingerText text="The scab." startFrame={270} duration={120} fontSize={64} color="#888" y={800} />
      </Sequence>

      <Sequence from={390} durationInFrames={90}>
        <StingerText text="It itches." startFrame={390} duration={90} fontSize={56} color="#AAA" y={800} />
      </Sequence>

      <Sequence from={480} durationInFrames={180}>
        <DualText leftText="Scratch" rightText="Keep the wound open" startFrame={480} duration={180} />
      </Sequence>

      <Sequence from={570} durationInFrames={90}>
        <DualText leftText="Feel the burn" rightText="Let it heal" startFrame={570} duration={90} />
      </Sequence>

      <Sequence from={660} durationInFrames={120}>
        <PulseBar startFrame={660} duration={120} color="#44FF88" x={540} y={800} width={300} height={3} />
        <StingerText
          text="Real freedom"
          startFrame={660}
          duration={120}
          fontSize={56}
          color="#44FF88"
          y={800}
        />
      </Sequence>

      <Sequence from={720} durationInFrames={60}>
        <StingerText
          text="is not needing the relief."
          startFrame={720}
          duration={60}
          fontSize={42}
          color="#88FFAA"
          y={880}
        />
      </Sequence>

      <Sequence from={800} durationInFrames={100}>
        <StingerText
          text="Sītibhūto'smi nibbuto."
          startFrame={800}
          duration={100}
          fontSize={40}
          color="#88FFAA"
          y={960}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
