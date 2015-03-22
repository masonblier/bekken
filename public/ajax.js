function ajax(path, params, success, failure) {
  if ('function'===typeof params) {
    failure = success;
    success = params;
    params = null;
  }
  if (!failure) failure = function(err){ console.error(err); };

  ajax.loadText(path, params, function(rsp){
    var rspobj = null;
    try {
      rspobj = JSON.parse(rsp);
    } catch (e) {
      return failure(e);
    }
    return success(rspobj);
  }, failure);
}

ajax.loadText = function(path, params, success, failure){
  var method;

  if ('function'===typeof params) {
    failure = success;
    success = params;
    params = null;
  }
  if (!params) {
    method = 'GET';
  } else {
    method = 'POST';
  }
  if (!failure) failure = function(err){ console.error(err); };

  var xhr = new XMLHttpRequest();
  xhr.open(method, path, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (success) success(xhr.responseText);
      } else {
        failure(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    failure(xhr.statusText);
  };
  xhr.send(params ? JSON.stringify(params) : null);
};
