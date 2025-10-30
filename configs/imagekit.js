import ImageKit from "@imagekit/nodejs";

const client = new ImageKit({
    privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
    publicKey: process.env["IMAGEKIT_PUBLIC_KEY"],
    urlEndpoint: process.env["IMAGEKIT_URL_ENDPOINT"],
});

const response = await client.files.upload({
  file: fs.createReadStream("path/to/file"),
  fileName: "file-name.jpg",
});

console.log(response); 

export default imageki;