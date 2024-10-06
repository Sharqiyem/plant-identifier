import * as ImagePicker from 'expo-image-picker';
import { resizeImage } from '@/lib/helpers';

export const pickImage = async (
  useCamera: boolean
): Promise<{ uri: string; base64: string; resizedUri: string } | null> => {
  let result;
  const options = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true
  };

  if (useCamera) {
    result = await ImagePicker.launchCameraAsync(options);
  } else {
    result = await ImagePicker.launchImageLibraryAsync(options);
  }

  if (result.canceled) return null;

  const res = result?.assets?.[0];
  if (!res) return null;
  const { uri, base64 } = res;
  if (!uri || !base64) return null;

  const resizedUri = await resizeImage(uri);
  return { uri, base64, resizedUri };
};
