import { VideoFullscreenUpdate, VideoFullscreenUpdateEvent } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'

/**
 * For fixing issue with video not rotating on full screen with Android - no issue with iOS
 */
export const onFullscreenUpdate = async ({ fullscreenUpdate }: VideoFullscreenUpdateEvent) => {
  switch (fullscreenUpdate) {
    case VideoFullscreenUpdate.PLAYER_WILL_PRESENT:
      await ScreenOrientation.unlockAsync() // only on Android required
      break
    case VideoFullscreenUpdate.PLAYER_WILL_DISMISS:
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // only on Android required
      break
  }
}
