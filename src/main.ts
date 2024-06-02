function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), time));
}

interface FileF {
  name: string;
  body: string;
  size: number;
}

function getFile(name: string): Promise<FileF> {
  return delay(500, { name, body: "...", size: 100 });
}

(async function main() {
  const file = getFile("file1.png");
  const result = await Promise.race([file, delay(1500, "timeout")]);

  if (result === "timeout") {
    console.log("Show Loading...");
    console.log(await file);
  } else {
    console.log("Paint!!");
  }
})();
