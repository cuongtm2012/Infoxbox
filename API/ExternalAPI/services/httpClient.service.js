import axios from 'axios';
import {registerInterceptor} from 'axios-cached-dns-resolve';
import config from '../config/config.js';

const axiosClient = axios.create(config.configCacheAxios);
import https from 'https';
import dnscache from 'dnscache';
const cache = dnscache({
    "enable" : true,
    "ttl" : 100,
    "cachesize" : 10000
});
import request from 'request';
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

function axiosGet(url, config, hostname) {
    return new Promise((resolve, reject) => {
        try {
            cache.lookup(hostname ? hostname : 'demo.econtract.fpt.com.vn', function(err, result) {
                console.log('result>>>>>>>>>>>>>>',result);
            });
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
            cache.lookup(hostname, function(err, result) {
                //do something with result
            });
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

function requestGet(url, headers, hostname) {
    return new Promise((resolve, reject) => {
        try {
            cache.lookup(hostname ? hostname : 'demo.econtract.fpt.com.vn', function(err, result) {
                console.log('result>>>>>>>>>>>>>>',result);
            });
            request({
                url: url,
                method: 'GET',
                headers: headers,
                timeout: 60 * 1000
            }, (error, response, body) => {
                resolve({status: response.statusCode, data: body});
            });
        } catch (err) {
            console.log(err.toString());
            reject(err)
        }
    })
}

export {axiosPost, axiosGet, httpsGet, requestGet};