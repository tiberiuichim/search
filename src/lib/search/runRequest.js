import fetch from 'node-fetch';
import https from 'https';
// import http from 'http';

export default async function runRequest(body) {
  const host = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';
  const index = 'esbootstrapdata-wise_latest';
  // const agent = host.startsWith('http:') ? httpAgent : httpsAgent;

  const url = `${host}/${index}/_search`;

  // console.log('url', url, body);

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    agent: httpsAgent,
  });

  try {
    // console.log('got resp', resp);

    const body = await resp.text();
    return { statusCode: resp.status, body: JSON.parse(body) };
  } catch (e) {
    return { statusCode: 500, body: `An error occurred: ${e}` };
  }
}

// Don't do this in production, this is in place to aid with demo environments which have self-signed certificates.
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// const httpAgent = new http.Agent();
// exports.handler = function (event, context, callback) {};
