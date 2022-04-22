import { Audio } from 'expo-av';
import PointOne from './../assets/sounds/point_one.mp3';
import PointTwo from './../assets/sounds/point_two.mp3';
import Whistle from './../assets/sounds/whistle.mp3';


export default class SoundEngine {

    constructor (matchJson) {
      const { sound } = Audio.Sound.createAsync(PointOne);
      this.playPointOneSound = sound;
    }

    async playPointOneSound () {
      this.playPointOneSound.playAsync();
    }

}





export const playPointOneSound = async (soundConfig) => {
  
  if (soundConfig) {
    await sound.playAsync();
  };
};

export const playPointTwoSound = async (soundConfig) => {
  const { sound } = await Audio.Sound.createAsync(PointTwo);
  if (soundConfig) {
    await sound.playAsync();
  };
};

export const playWhistleSound = async (soundConfig) => {
  const { sound } = await Audio.Sound.createAsync(Whistle);
  if (soundConfig) {
    await sound.playAsync();
  };
};
