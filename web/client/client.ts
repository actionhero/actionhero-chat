import Axios, { AxiosRequestConfig, Method } from "axios";
import PackageJSON from "../../package.json";

export class Client {
  apiEndpoint: string;
  cookies: any;

  csrfToken() {
    if (window && window.localStorage) {
      const csrfToken = window.localStorage.getItem("session:csrfToken");
      return csrfToken;
    }
  }

  async action(verb = "get", path, data: AxiosRequestConfig["data"] = {}) {
    const options: AxiosRequestConfig = {
      params: null,
      data: null,
      url: "" + path,
      withCredentials: true,
      //@ts-ignore
      agent: `actionhero-chat-web-${PackageJSON.version}`,
      method: verb.toLowerCase() as Method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    data.csrfToken = this.csrfToken();

    if (data) {
      for (const i in data) {
        if (data[i] === null || data[i] === undefined) {
          delete data[i];
        }
      }

      if (data.file) {
        delete options.headers;
        let dataForm = new FormData();
        for (const i in data) {
          dataForm.append(i, data[i]);
        }
        data = dataForm;
      }

      if (options.method === "get") {
        options.params = data;
      } else {
        options.data = data;
      }
    }

    try {
      const response = await Axios(options);
      if (response.data && response.data["error"]) {
        throw response.data["error"]["message"]
          ? response.data["error"]["message"]
          : response.data["error"];
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(
          error.response.data.error.message
            ? error.response.data.error.message
            : error.response.data.error
        );
      } else {
        throw error;
      }
    }
  }
}
