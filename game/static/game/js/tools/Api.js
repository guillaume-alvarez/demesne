var API_URL = '/api/';
var TIMEOUT = 10000;

var _pendingRequests = {};

function abortPendingRequests(key) {
    if (_pendingRequests[key]) {
        _pendingRequests[key]._callback = function(){};
        _pendingRequests[key].abort();
        _pendingRequests[key] = null;
    }
}

function makeUrl(type, id) {
    var url = API_URL + type + '/';
    if (id) url += id + '/';
    return url;
}

function dispatchSuccess(action, response, params) {
    var payload = {actionType: action, response: response.body};
    if (params) payload.queryParams = params;
    AppDispatcher.dispatch(payload);
}

function dispatchError(action, reason, params) {
    var payload = {actionType: action, error: reason};
    if (params) payload.queryParams = params;
    AppDispatcher.dispatch(payload);
}

// return successful response, else return request Constants
function makeDigestFun(action, params) {
    return function (err, res) {
        if (err && err.timeout === TIMEOUT) {
            dispatchError(action, 'TIMEOUT', params);
        } else if (!res.ok) {
            if (res.body) {
                dispatchError(action, res.body, params);
            } else if (res.text) {
                dispatchError(action, res.text, params);
            } else if (res.error) {
                dispatchError(action, res.error, params);
            } else {
                dispatchError(action, {status: res.status}, params);
            }
        } else {
            dispatchSuccess(action, res, params);
        }
    };
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// a simple get request
function get(url) {
    return superagent
        .get(url)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate')
        .timeout(TIMEOUT)
        .query();
}

function post(url, data) {
    var csrftoken = getCookie('csrftoken');
    return superagent
        .post(url)
        .send(data)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate')
        .set("X-CSRFToken", csrftoken)
        .timeout(TIMEOUT)
        .query();
}

function patch(url, data) {
    var csrftoken = getCookie('csrftoken');
    return superagent
        .patch(url)
        .send(data)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate')
        .set("X-CSRFToken", csrftoken)
        .timeout(TIMEOUT)
        .query();
}

var Api = {
    getData: function(type, id, action, params) {
        var url = makeUrl(type, id);
        abortPendingRequests(url);
        _pendingRequests[url] = get(url).end(
            makeDigestFun(action, params)
        );
    },

    createData: function(type, data, action, params) {
        var url = makeUrl(type, null);
        abortPendingRequests(url);
        _pendingRequests[url] = post(url, data).end(
            makeDigestFun(action, params)
        );
    },

    updateData: function(type, id, data, action, params) {
        var url = makeUrl(type, id);
        abortPendingRequests(url);
        _pendingRequests[url] = post(url, data).end(
            makeDigestFun(action, params)
        );
    }
};