import { Composition } from "remotion";
import { Concept1 } from "./Concept1";
import { Concept2 } from "./Concept2";
import { Concept3 } from "./Concept3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Concept1-ChildAndBall"
        component={Concept1}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Concept2-TheFire"
        component={Concept2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Concept3-TheWound"
        component={Concept3}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
