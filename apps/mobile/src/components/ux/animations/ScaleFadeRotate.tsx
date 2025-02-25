import type {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  IEntryExitAnimationBuilder,
} from "react-native-reanimated"
import { ComplexAnimationBuilder, withSpring } from "react-native-reanimated"

export class ScaleFadeRotateIn
  extends ComplexAnimationBuilder
  implements IEntryExitAnimationBuilder
{
  static presetName = "ScaleFadeRotateIn"
  static override createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T> {
    return new ScaleFadeRotateIn() as InstanceType<T>
  }

  override type = withSpring

  override build = (): EntryExitAnimationFunction => {
    const [animation, config] = this.getAnimationAndConfig()
    const callback = this.callbackV
    const { initialValues } = this

    return () => {
      "worklet"
      return {
        animations: {
          opacity: animation(1, config),
          transform: [{ scale: animation(1, config) }, { rotate: animation(0, config) }],
        },
        initialValues: {
          opacity: 0.8,
          transform: [{ scale: 0.92 }, { rotate: 0.2 }],
          ...initialValues,
        },
        callback,
      } as any
    }
  }
}
