import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.ImageKit_Public_Key!,
  privateKey: process.env.ImageKit_Private_Key!,
  urlEndpoint: process.env.ImageKit_URL!,
});
