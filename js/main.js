/*The main script file. In this file, most of the variables are declared, 
  and the basic functions and handlers. Tool's work starts here.
*/

var control = document.getElementById("your-file"),
    textContents = "",
    banControl = document.getElementById("your-ban"),
    params_head = document.getElementById("search_head"),
    sentences = [],
    sentence_pairs = [],
    anaphora_examples = [],
    epiphora_examples = [],
    simploka_examples = [],
    anadiplosis_examples = [],
    srepeat_examples = [],
    result = [],
    unions = [
              "а", "и", "но", "да", "что", "зато", "если", "потому", "поэтому", "тоже", "также",
              "but", "till", "as", "if", "after", "until", "because"
             ],
    prepositions = [
                  "без", "в", "для", "за", "из", "к", "на", "над", "о", "об", "от", "по", "под", "пред", "при", "про", "с", "у", 
                  "a", "the", "to", "at", "in", "about", "against", "before", "of", "an", "on", "is", "are", "be", "was", "were"
                   ],
    srepeat_examples = [],
    anadiplosis_checker = [],
    srepeat_view = [],
    srepeat_checker = [],
    epiphora_checker = [],
    simploka_view = [];

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
    document.title = "DONE";
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

function createWordList(content){
  var text = content.replace(/[^a-zA-Zа-яА-ЯёЁ \n']/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.toLowerCase();
  text = text.substring(0,text.length-1);
  text = text.split(" ");

  var result = text.reduce(function (acc, el) {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  result = sortProps(result);

  for(key in result) {
    tableItem = [
      document.createElement('tr'),
      document.createElement('td'),
      document.createElement('td'),
      document.createElement('a'),
      document.createElement('td'),
      document.createElement('a')
    ]
    tableItem[3].textContent = key;
    tableItem[3].onclick = function(){
      brighter(this.textContent, '');
    };
    tableItem[1].appendChild(tableItem[3]);
    tableItem[2].textContent = result[key];
    tableItem[1].style.setProperty("width", "50%");
    tableItem[2].style.setProperty("width", "50%");
    tableItem[0].appendChild(tableItem[1]);
    tableItem[0].appendChild(tableItem[2]);
    words.appendChild(tableItem[0]);

    item = document.createElement('option');
    item.textContent = key;
    keywords.appendChild(item);
  }
}

function sortProps(result) {
  var temp=[];
  for(key in result) {
    temp.push([key, result[key]]);
  }
  temp.sort(function(a,b){
    return b[1] - a[1];
  });
  var temp_result = {};
  for(i=0;i<temp.length;i++){
    temp_result[temp[i][0]] = temp[i][1];
  }
  return temp_result;
}

function createWordListBanned(content, banlist){
  var text = content.replace(/[^a-zA-Zа-яА-ЯёЁ \n']/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.toLowerCase();
  text = text.substring(0,text.length-1);
  text = text.split(" ");
  banlist = banlist.toLowerCase();
  banlist = banlist.split(" ");

  var result = text.reduce(function (acc, el) {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  result = sortProps(result);

  for(key in result) {
    flag = true
    for(i=0; i<banlist.length;i++){
      if(key == banlist[i]){
        flag = false;
        break;
      }
    }
    if (flag) {
      tableItem = [
        document.createElement('tr'),
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('a')
      ]
      tableItem[3].textContent = key;
      tableItem[3].onclick = function(){
        brighter(this.textContent, '');
      };
      tableItem[1].appendChild(tableItem[3]);
      tableItem[2].textContent = result[key];
      tableItem[0].appendChild(tableItem[1]);
      tableItem[0].appendChild(tableItem[2]);
      words.appendChild(tableItem[0]);
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

function getAllSentences() {
  text = workarea.textContent;
  sentences = [];
  tempSentence = "";
  sub_array = [];
  while(text.match(/[^.!?]+[.!?]{1,3}/)) {
    tempSentence=text.match(/[^.!?]+[.!?]{1,3}/);
    tempSentence = tempSentence[0];
    if(tempSentence.match(/\n/g) != null) {
      sub_array = tempSentence.split(/\n/);
      if(i==312) debugger;
      for(i=0; i<sub_array.length; i++) {
        if(sub_array[i].match(/[a-zA-Zа-яА-ЯёЁ]/) != null) {
          if(sub_array.length == 0){
            sentences.push(sub_array[i]);
          }
          else {
            sentences.push(" "+sub_array[i]);
          }
        }
      }
    }
    else {
      sentences.push(tempSentence);
    }
    text = text.replace(tempSentence, "");
  }
  sub_array = [];
  flag = true;
  number = 0;
  while (flag != false) {
    flag = false;
    for(var i = 1; i<sentences.length; i++) {
      if(sentences[i][0] != ' ' && sentences[i][0] != '↵' || (sentences[i][1] == ")" && sentences[i][0] == " ")) {
        flag = true;
        number = i;
      }
    }
    if(flag) {
      sentences[number-1] = sentences[number-1] + sentences[number];
      sub_array = [];
      for(i=0; i<sentences.length; i++) {
        if(i != number) {
          sub_array.push(sentences[i]);
        }
      }
      sentences = sub_array;
    }
  }
  flag = true;
  while (flag != false) {
    flag = false;
    for(var i = 1; i<sentences.length; i++) {
      if(sentences[i][0] == ' ' && sentences[i].length == 3 && sentences[i][sentences[i].length-1] == '.') {
        flag = true;
        number = i;
      }
    }
    if(flag) {
      sentences[number-1] = sentences[number-1] + sentences[number] + sentences[number+1];
      sub_array = [];
      for(i=0; i<sentences.length; i++) {
        if(i != number && i != number + 1) {
          sub_array.push(sentences[i]);
        }
      }
      sentences = sub_array;
    }
  }
  flag = true;
  while (flag != false) {
    flag = false;
    for(var i = 1; i<sentences.length; i++) {
      if(sentences[i].match(/[:]\s$/) != null || sentences[i].match(/Mr[.]$/) != null) {
        flag = true;
        number = i;
      }
    }
    if(flag) {
      sentences[number] = sentences[number] + sentences[number+1];
      sub_array = [];
      for(i=0; i<sentences.length; i++) {
        if(i != number + 1) {
          sub_array.push(sentences[i]);
        }
      }
      sentences = sub_array;
    }
  }
  for(var i = 1; i<sentences.length; i++) {
    sentences[i] = sentences[i].replace(/\s+/, " ");
    sentences[i] = sentences[i].substring(1);
  }
  getAllSentencePairs();
}

function getAllSentencePairs() {
  for(i=1; i<sentences.length; i++) {
    sentence_pairs.push(sentences[i-1] + " " + sentences[i]);
  }
}

params_head.onclick = function () {
  if(search_body.clientHeight == 0) {
    search_body.style.display = "block";
  }
  else
  {
    search_body.style.display = "none";
  }
}
