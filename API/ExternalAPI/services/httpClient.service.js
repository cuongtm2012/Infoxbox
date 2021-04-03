import axios from 'axios';
import {registerInterceptor} from 'axios-cached-dns-resolve';
import config from '../config/config.js';

const axiosClient = axios.create(config.configCacheAxios);
import https from 'https';

registerInterceptor(axiosClient);
// getUri(config?: AxiosRequestConfig): string;
// request<T = any, R = AxiosResponse<T>> (config: AxiosRequestConfig): Promise<R>;
// get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
// delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
// head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
// post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
// put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
// patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
function axiosPost(url, data, config) {
    return new Promise((resolve, reject) => {
        try {
            resolve(axios.post(url, data, config));
        } catch (err) {
            console.log(err.toString());
            reject(err)
        }
    })
}

function axiosGet(url, config) {
    return new Promise((resolve, reject) => {
        try {
            resolve(axios.get(url, config));
        } catch (err) {
            console.log(err.toString());
            reject(err)
        }
    })
}

function httpsGet(hostname, port, path, headers) {
    return new Promise((resolve, reject) => {
        try {
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'GET',
                headers: headers,
                timeout: 60 * 1000
            }
            const req = https.request(options, res => {
                let result = '';
                res.on('data', d => {
                    result += d;
                    resolve({status: res.statusCode, data: result});
                })
            })

            req.on('error', error => {
                console.error(error);
                reject(error)
            })
            req.end();
        } catch (e) {
            reject(e);
        }
    })
}

export {axiosPost, axiosGet, httpsGet};