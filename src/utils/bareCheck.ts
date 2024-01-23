export async function bareVerify(bare: string): Promise<boolean> {
  const headers = new Headers({
    "x-bare-url": "https://www.google.com",
    "X-Bare-Headers": JSON.stringify({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    }),
  });
  fetch(bare + "v3/", {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (
        response.headers.get("x-bare-status") === "200" ||
        response.headers.get("x-bare-status") === "302"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
    console.log(error)
      return false;
    });
    return false;
}
export async function proxyCompat(bare: string): Promise<boolean> {
  const headers = new Headers({
    "x-bare-url": "https://www.google.com",
    "X-Bare-Headers": JSON.stringify({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    }),
  });
  fetch(bare + "v3/", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (Object.prototype.hasOwnProperty.call(data, "HTTPProxy")) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
        console.log(error)
      return false;
    });
  return false;
}
