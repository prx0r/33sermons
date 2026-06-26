import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";

const FadeText: React.FC<{
  text: string;
  startFrame: number;
  duration: number;
  style?: React.CSSProperties;
  fontSize?: number;
  color?: string;
  italic?: boolean;
}> = ({ text, startFrame, duration, style, fontSize = 72, color = "#E8D5B7", italic }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, 15, duration - 15, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 20], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        textAlign: "center",
        top: "50%",
        transform: `translateY(calc(-50% + ${y}px))`,
        opacity,
        fontFamily: italic ? "'Cormorant Garamond', serif" : "'Playfair Display', serif",
        fontWeight: italic ? 400 : 300,
        fontStyle: italic ? "italic" : "normal",
        fontSize,
        color,
        letterSpacing: "0.03em",
        lineHeight: 1.4,
        padding: "0 80px",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const WordReveal: React.FC<{
  words: string[];
  startFrame: number;
  gap: number;
  style?: React.CSSProperties;
  fontSize?: number;
  color?: string;
}> = ({ words, startFrame, gap, style, fontSize = 60, color = "#E8D5B7" }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const totalDur = words.length * gap;
  const overallOpacity = interpolate(local, [0, 10, totalDur - 10, totalDur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        textAlign: "center",
        top: "50%",
        transform: "translateY(-50%)",
        opacity: overallOpacity,
        fontFamily: "'Playfair Display', serif",
        fontWeight: 300,
        fontSize,
        color,
        lineHeight: 1.6,
        padding: "0 80px",
        ...style,
      }}
    >
      {words.map((w, i) => {
        const wLocal = local - i * gap;
        const wOpacity = interpolate(wLocal, [0, 5, gap - 5, gap], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              opacity: wOpacity,
              display: "inline-block",
              marginRight: "0.3em",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Concept1: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F0D0A",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,140,100,0.08) 0%, rgba(180,140,100,0.02) 50%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <Sequence from={0} durationInFrames={150}>
        <FadeText text="Before the word..." startFrame={0} duration={150} />
      </Sequence>

      <Sequence from={150} durationInFrames={150}>
        <FadeText text="...there was the touch." startFrame={150} duration={150} color="#C4A97D" />
      </Sequence>

      <Sequence from={300} durationInFrames={240}>
        <WordReveal
          words={["A", "child", "meets", "a", "ball", "for", "the", "first", "time."]}
          startFrame={300}
          gap={24}
          fontSize={64}
        />
      </Sequence>

      <Sequence from={540} durationInFrames={120}>
        <FadeText text="Not 'ball.'" startFrame={540} duration={120} color="#C4A97D" fontSize={80} />
      </Sequence>

      <Sequence from={660} durationInFrames={180}>
        <WordReveal
          words={["Round.", "Smooth.", "Bouncy.", "Warm."]}
          startFrame={660}
          gap={36}
          fontSize={72}
          color="#C4A97D"
        />
      </Sequence>

      <Sequence from={780} durationInFrames={120}>
        <FadeText
          text="Feeling. Contact. Perception."
          startFrame={780}
          duration={120}
          fontSize={48}
          italic
        />
      </Sequence>

      <Sequence from={850} durationInFrames={50}>
        <FadeText
          text="This is nāma-rūpa."
          startFrame={850}
          duration={50}
          fontSize={36}
          color="#A08050"
          italic
        />
      </Sequence>
    </AbsoluteFill>
  );
};
