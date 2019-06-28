//This file contains all handlers for buttons and some events on the page

var control = document.getElementById("your-file"),
    textContents = "",
    banControl = document.getElementById("your-ban"),
    params_head = document.getElementById("search_head"),
    workarea_text = "";

control.addEventListener("change", function(event) {
  file = control.files[0]
  var reader = new FileReader();
  reader.onload = function(event) {
    document.title = "IN PROGRESS";
    var contents = event.target.result;
    textContents = contents;
    contents = prepareText(contents);
    (document.getElementById("file_title")).textContent = file.name.replace(/\.\w*/g,"")
    workarea.innerHTML = contents;
    words.innerHTML = "";
    keywords.innerHTML = "";
    results_single.innerHTML = "";
    sentences = [];
    sentence_pairs = [];
    anaphora_examples = [];
    epiphora_examples = [];
    simploka_examples = [];
    anadiplosis_examples = [];
    srepeat_examples = [];
    multiunion_examples = [];
    multiunion_pairs_examples = [];
    result = [];
    workarea_text = workarea.textContent;
    createWordList(contents)
    search_head.style.visibility = "visible";
    getAllSentences();
    (document.getElementById("anaphora_count")).textContent = getAnaphoraCount();
    anaphora_examples = result;
    (document.getElementById("epiphora_count")).textContent = getEpiphoraCount();
    epiphora_examples = result;
    (document.getElementById("simploka_count")).textContent = getSimplokaCount();
    simploka_examples = result;
    (document.getElementById("anadiplosis_count")).textContent = getAnadiplosisCount();
    anadiplosis_examples = result;
    (document.getElementById("srepeat_count")).textContent = getSrepeatCount();
    (document.getElementById("munion_count")).textContent = getMultiUnionCount();
    (document.getElementById("aposiopesis_count")).textContent = getAposiopesisCount();
    ban_label = document.getElementById("ban-label");
    ban_label.style.display = "block";
    search_head.style.display = "block";
    load_json.style.display = "block";
    document.title = "DONE";
  };
  reader.onerror = function(event) {
    words.innerHTML = "";
    keywords.innerHTML = "";
    results_single.innerHTML = "";
    workarea.textContent = "Файл не может быть прочитан!";
  };
  if (file.type.indexOf("jpeg") != -1 || file.type.indexOf("application") != -1 || file.type == ""){
    words.innerHTML = "";
    keywords.innerHTML = "";
    results_single.innerHTML = "";
    workarea.textContent = "Файл не может быть прочитан!";
  }
  else {
    reader.readAsText(file);
  }
});

function prepareText(text) {
  text = text.replace(/[.]\s[.]\s[.]/g, "...");
  text = text.replace(/“|”/g, '"');
  text = text.replace(/—/g, "-");
  text = text.replace(/\s+/, " ");
  text = text.replace(/\n/g, "<p>");
  return text;
}

banControl.addEventListener("change", function(event) {
  file = banControl.files[0]
  var reader = new FileReader();
  reader.onload = function(event) {
    var banContents = event.target.result;
    words.innerHTML = "";
    keywords.innerHTML = "";
    if (textContents != ""){
      createWordListBanned(textContents, banContents);
    }
  };
  reader.onerror = function(event) {
    workarea.textContent = "Файл не может быть прочитан!"
  };
  if (file.type.indexOf("jpeg") != -1 || file.type.indexOf("application") != -1 || file.type == ""){
    workarea.textContent = "Файл не может быть прочитан!"
  }
  else {
    reader.readAsText(file);
  }
});

params_head.onclick = function () {
  if(search_body.clientHeight == 0) {
    search_body.style.display = "block";
  }
  else
  {
    search_body.style.display = "none";
  }
}

function openSearch() {
  opener = document.getElementById("opener");
  switch(opener.textContent) {
    case "▼": {
      opener.textContent = "▲";
      search_input.style.display = "flex";
      opener.style.setProperty("border-radius", "0");
      break;
    }
    case "▲": {
      opener.textContent = "▼";
      search_input.style.display = "none";
      opener.style.setProperty("border-radius", "0 0 5px 5px");
      break;
    }
  }
}

function openText() {
  textOpener = document.getElementById("text_opener");
  textWindow = document.getElementById("text_window");
  resultSingle = document.getElementById("results_single");
  bodyWindow = document.getElementById("results_body");
  switch(textOpener.textContent) {
    case "▼": {
      textOpener.textContent = "▲";
      if(bodyWindow.style.display == "none") {
        resultSingle.style.setProperty("height", "40vh");  
      }
      else {
        resultSingle.style.setProperty("height", "25vh");
      }
      textWindow.style.display = "flex";
      textOpener.style.setProperty("border-radius", "0");
      break;
    }
    case "▲": {
      textOpener.textContent = "▼";
      textWindow.style.display = "none";
      if(bodyWindow.style.display == "none") {
        resultSingle.style.setProperty("height", "80vh");  
      }
      else {
        resultSingle.style.setProperty("height", "60vh");
      }
      textOpener.style.setProperty("border-radius", "0 0 5px 5px");
      break;
    }
  }
}

function openResultBody() {
  bodyOpener = document.getElementById("result_body_opener");
  bodyWindow = document.getElementById("results_body");
  resultSingle = document.getElementById("results_single");
  switch(bodyOpener.textContent) {
    case "▼": {
      bodyOpener.textContent = "▲";
      resultSingle.style.setProperty("height", "25vh");
      bodyWindow.style.display = "flex";
      break;
    }
    case "▲": {
      bodyOpener.textContent = "▼";
      bodyWindow.style.display = "none";
      resultSingle.style.setProperty("height", "40vh");
      break;
    }
  }
}

function openResults() {
  res_body = document.getElementById("results_body");
  res_head = document.getElementById("results_head");
  res_single = document.getElementById("results_single");
  bodyOpener = document.getElementById("result_body_opener");
  switch(res_body.style.display){
    case "flex": {
      res_body.style.display = "none";
      res_single.style.display = "none";
      bodyOpener.style.display = "none";
      res_head.style.setProperty("border-radius", "5px");
      break;
    }
    case "none": {
      res_body.style.display = "flex";
      res_single.style.display = "block";
      bodyOpener.style.display = "block";
      res_head.style.setProperty("border-radius", "5px 5px 0 0");
      break;
    }
  }
}

anaphora.onchange = function() {
  id = this.id;
  if(this.checked) {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "block";
  }
  else {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "none";
  }
}

epiphora.onchange = function() {
  id = this.id;
  if(this.checked) {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "block";
  }
  else {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "none";
  }
}

simploka.onchange = function() {
  id = this.id;
  if(this.checked) {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "block";
  }
  else {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "none";
  }
}

anadiplosis.onchange = function() {
  id = this.id;
  if(this.checked) {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "block";
  }
  else {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "none";
  }
}

srepeat.onchange = function() {
  id = this.id;
  if(this.checked) {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "block";
  }
  else {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "none";
  }
}

munion.onchange = function() {
  id = this.id;
  if(this.checked) {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "block";
  }
  else {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "none";
  }
}

aposiopesis.onchange = function() {
  id = this.id;
  if(this.checked) {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "block";
  }
  else {
    column_id = id + "_column";
    column = document.getElementById(column_id);
    column.style.display = "none";
  }
}

list_chooser.onchange = function() {
  res_single = document.getElementById("results_single");
  res_single.innerHTML = "";
  if(list_chooser.value == "Selected lexical aspects:") {
    anaphora_check.style.display = "block";
    epiphora_check.style.display = "block";
    simploka_check.style.display = "block";
    anadiplosis_check.style.display = "block";
    srepeat_check.style.display = "block";
    munion_check.style.display = "none";
    aposiopesis_check.style.display = "none";
    anaphora_column.style.display = "block";
    epiphora_column.style.display = "block";
    simploka_column.style.display = "block";
    anadiplosis_column.style.display = "block";
    srepeat_column.style.display = "block";
    munion_column.style.display = "none";
    aposiopesis_column.style.display = "none";
  }
  if(list_chooser.value == "Selected gramatical aspects:") {
    anaphora_check.style.display = "none";
    epiphora_check.style.display = "none";
    simploka_check.style.display = "none";
    anadiplosis_check.style.display = "none";
    srepeat_check.style.display = "none";
    munion_check.style.display = "block";
    aposiopesis_check.style.display = "block";
    anaphora_column.style.display = "none";
    epiphora_column.style.display = "none";
    simploka_column.style.display = "none";
    anadiplosis_column.style.display = "none";
    srepeat_column.style.display = "none";
    munion_column.style.display = "block";
    aposiopesis_column.style.display = "block";
  }
}

function hideResultsChecker() {
  checker = document.getElementById("results-checker");
  checker_button = document.getElementById("results-checker-opener");
  switch(checker.style.display){
    case "block": {
      checker.style.display = "none";
      checker_button.textContent = "►";
      break;
    }
    case "none": {
      checker.style.display = "block";
      checker_button.textContent = "◄"
      break;
    }
  }
}

function searchAction() {
  if(phrase.value != "") {
    brighter(phrase.value);
    phrase.value = "";
  }
  else {
    brighter(keywords.value);
  }
}