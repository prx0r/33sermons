import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

const FadeText: React.FC<{
  text: string;
  startFrame: number;
  duration: number;
  style?: React.CSSProperties;
  fontSize?: number;
  color?: string;
}> = ({ text, startFrame, duration, style, fontSize = 64, color = "#FFE0B2" }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, 15, duration - 15, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 20], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        textAlign: "center",
        top: "50%",
        transform: `translateY(calc(-50% + ${y}px))`,
        opacity,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 200,
        fontSize,
        color,
        letterSpacing: "0.05em",
        lineHeight: 1.5,
        padding: "0 80px",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const FireParticle: React.FC<{
  frame: number;
  index: number;
  total: number;
}> = ({ frame, index, total }) => {
  const phase = (index / total) * Math.PI * 2;
  const life = 120;
  const local = ((frame + index * 7) % life);
  const progress = local / life;
  const opacity = interpolate(progress, [0, 0.2, 0.7, 1], [0, 0.6, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(progress, [0, 1], [540 + Math.sin(phase + progress * 3) * 80, 540 + Math.sin(phase + 3) * 150]);
  const y = interpolate(progress, [0, 1], [1200, 600]);
  const size = interpolate(progress, [0, 1], [8, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,${150 + Math.sin(phase) * 50},50,${opacity * 0.8}) 0%, rgba(255,100,20,${opacity * 0.3}) 100%)`,
        left: x,
        top: y,
        opacity,
        filter: `blur(${size * 0.5}px)`,
      }}
    />
  );
};

const FireGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const intensity = 0.08 + Math.sin(frame * 0.03) * 0.03;
  return (
    <div
      style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,150,50,${intensity}) 0%, transparent 70%)`,
        left: "50%",
        top: "70%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

const FuelLines: React.FC<{ frame: number }> = ({ frame }) => {
  const lines: React.ReactElement[] = [];
  for (let i = 0; i < 12; i++) {
    const phase = (i / 12) * Math.PI * 2;
    const len = 40 + Math.sin(frame * 0.02 + phase) * 20;
    const opacity = 0.1 + Math.sin(frame * 0.01 + phase) * 0.05;
    lines.push(
      <div
        key={i}
        style={{
          position: "absolute",
          bottom: 0,
          left: 540 + Math.cos(phase) * 80,
          width: 2,
          height: len,
          background: `linear-gradient(to top, rgba(255,150,50,${opacity}), transparent)`,
          opacity,
          transform: `rotate(${Math.cos(phase) * 15}deg)`,
        }}
      />,
    );
  }
  return <>{lines}</>;
};

export const Concept2: React.FC = () => {
  const frame = useCurrentFrame();
  const particles: React.ReactElement[] = [];
  for (let i = 0; i < 30; i++) {
    particles.push(<FireParticle key={i} frame={frame} index={i} total={30} />);
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0806",
        overflow: "hidden",
      }}
    >
      <FuelLines frame={frame} />
      <FireGlow frame={frame} />
      {particles}

      <Sequence from={0} durationInFrames={150}>
        <FadeText text="Existence is a fire." startFrame={0} duration={150} fontSize={80} color="#FFCC80" />
      </Sequence>

      <Sequence from={150} durationInFrames={180}>
        <FadeText
          text="It burns dependent on fuel."
          startFrame={150}
          duration={180}
          fontSize={56}
          color="#FFB74D"
        />
      </Sequence>

      <Sequence from={330} durationInFrames={150}>
        <FadeText
          text="The fuel is grasping."
          startFrame={330}
          duration={150}
          fontSize={52}
          color="#FFA726"
        />
      </Sequence>

      <Sequence from={480} durationInFrames={150}>
        <FadeText
          text="When the fuel runs out..."
          startFrame={480}
          duration={150}
          fontSize={56}
          color="#FFCC80"
        />
      </Sequence>

      <Sequence from={630} durationInFrames={150}>
        <FadeText
          text="...the fire goes out."
          startFrame={630}
          duration={150}
          fontSize={72}
          color="#FFE0B2"
        />
      </Sequence>

      <Sequence from={750} durationInFrames={150}>
        <FadeText
          text="It doesn't go anywhere."
          startFrame={750}
          duration={150}
          fontSize={48}
          color="#A08050"
        />
      </Sequence>

      <Sequence from={820} durationInFrames={80}>
        <FadeText
          text="It simply stops burning."
          startFrame={820}
          duration={80}
          fontSize={52}
          color="#C4A97D"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
