const codeblocks: any = {
  'JS Fectch': {
    language: 'javascript',
    code: (
      triggerName: string,
      origin: string,
      admin_secret_key: string,
      variables: any
    ) => `var myHeaders = new Headers();
myHeaders.append("x-admin-secret-key", "${admin_secret_key}");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  variables: ${JSON.stringify(
    variables.reduce(
      (prevValue: any, key: string) => ({
        ...prevValue,
        [key]: 'xxxx'
      }),
      {}
    )
  )}
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("${origin}/api/v1/manual_event/${triggerName}", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));`
  },
  'NodeJS Axios': {
    language: 'javascript',
    code: (
      triggerName: string,
      origin: string,
      admin_secret_key: string,
      variables: any
    ) => `var axios = require('axios');
var data = JSON.stringify({
  "variables": ${JSON.stringify(
    variables.reduce(
      (prevValue: any, key: string) => ({
        ...prevValue,
        [key]: 'xxxx'
      }),
      {}
    )
  )}
});
    
var config = {
  method: 'post',
  url: '${origin}/api/v1/manual_event/${triggerName}',
  headers: { 
    'x-admin-secret-key': '${admin_secret_key}', 
    'Content-Type': 'application/json'
  },
  data : data
};
    
axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});`
  },
  'Go-Native': {
    language: 'go',
    code: (
      triggerName: string,
      origin: string,
      admin_secret_key: string,
      variables: any
    ) => `package main

import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)
    
func main() {

  url := "${origin}/api/v1/manual_event/${triggerName}"
  method := "POST"

  payload := strings.NewReader(\`{
  "variables": ${JSON.stringify(
    variables.reduce(
      (prevValue: any, key: string) => ({
        ...prevValue,
        [key]: 'xxxx'
      }),
      {}
    )
  )}
}
    
\`)
    
  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, payload)

  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add("x-admin-secret-key", "${admin_secret_key}")
  req.Header.Add("Content-Type", "application/json")

  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}`
  },
  'Java OkHttp': {
    language: 'java',
    code: (
      triggerName: string,
      origin: string,
      admin_secret_key: string,
      variables: any
    ) => `OkHttpClient client = new OkHttpClient().newBuilder().build();
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\\n  \\"variables\\": ${JSON.stringify(
      variables.reduce(
        (prevValue: any, key: string) => ({
          ...prevValue,
          [key]: 'xxxx'
        }),
        {}
      )
    ).replace(/"/g, '\\"')}\\n}\\n\\n");
Request request = new Request.Builder()
  .url("${origin}/api/v1/manual_event/${triggerName}")
  .method("POST", body)
  .addHeader("x-admin-secret-key", "${admin_secret_key}")
  .addHeader("Content-Type", "application/json")
  .build();
Response response = client.newCall(request).execute();`
  },
  'Python Requests': {
    language: 'python',
    code: (
      triggerName: string,
      origin: string,
      admin_secret_key: string,
      variables: any
    ) => `import requests
import json
    
url = "${origin}/api/v1/manual_event/${triggerName}"
    
payload = json.dumps({
  "variables": ${JSON.stringify(
    variables.reduce(
      (prevValue: any, key: string) => ({
        ...prevValue,
        [key]: 'xxxx'
      }),
      {}
    )
  )}
})
headers = {
  'x-admin-secret-key': '${admin_secret_key}',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)`
  }
};

export default codeblocks;
