"use strict";

//DOM
var inputSearch = document.querySelector('.inputSearch');
var searchClick = document.querySelector('.searchClick');
var changeClick = document.querySelector('.changeClick');
var showChangeClick = document.querySelector('.showChangeClick');
var selectMenu = document.querySelector('.selectMenu');
var typeButton = document.querySelector('.typeButton');
var displayCard = document.querySelector('.displayCard');
var chooseArea = document.querySelectorAll('.areaSelectSection >.formSection >.form-check > input');
var chooseType = document.querySelectorAll('.chooseType >.formSection >.form-check > input');
var advanchSearchButton = document.querySelector('.advanchSearchButton'); //全域變數

var zipCodeMap = {
  100: '中正區',
  103: '大同區',
  104: '中山區',
  105: '松山區',
  106: '大安區',
  108: '萬華區',
  110: '信義區',
  111: '士林區',
  112: '北投區',
  114: '內湖區',
  115: '南港區',
  116: '文山區'
}; //class的分類["遊憩類","自然風景類","溫泉類","都會公園類","體育健身類","藝術類","其他"]
//想出發去哪裡

function wantToGOWhere() {
  var searchKeyWord = '';

  if (inputSearch.value === '') {
    alert('輸入到空白，請重新輸入');
  } else {
    //console.log(inputSearch.value)
    searchKeyWord = "contains(DescriptionDetail ,'".concat(inputSearch.value, "') or contains(Name, '").concat(inputSearch.value, "') or contains(Address ,'").concat(inputSearch.value, "')"); //`contains(DescriptionDetail ,'熱門') or contains(Name, '熱門') or contains(Address ,'熱門')`
    //console.log(searchKeyWord)

    searchProcess(searchKeyWord);
  }
} //進階選擇


function advanceChose() {
  var chooseZipCode = [];
  var ZipCodeString = '';
  var chooseTypeArray = [];
  var TypeString = '';
  var searchKeyWord = ''; //取得選擇區域的值

  chooseArea.forEach(function (item) {
    if (item.checked === true) {
      chooseZipCode.push(item.value); //console.log(chooseZipCode);
    }
  });
  chooseZipCode.forEach(function (item) {
    ZipCodeString += "ZipCode eq '".concat(item, "' or ");
  }); //去掉最後面三個字元

  ZipCodeString = ZipCodeString.slice(0, -3); //取得選擇類型的值

  chooseType.forEach(function (item) {
    if (item.checked === true) {
      chooseTypeArray.push(item.value);
    }
  });
  console.log(chooseTypeArray);
  chooseTypeArray.forEach(function (item) {
    if (item === '熱門') {
      TypeString += "contains(Name, '".concat(item, "')");
    } else if (item !== '熱門') {
      TypeString += " or Class1 eq '".concat(item, "' or Class2 eq '").concat(item, "' or Class3 eq '").concat(item, "'");
    }
  }); //如果TypeString沒有熱門兩個字則刪除前4個字元

  if (TypeString.indexOf('熱門') === -1) {
    TypeString = TypeString.slice(4);
  }

  if (chooseZipCode.length === 0 && chooseTypeArray.length > 0) {
    searchKeyWord = TypeString;
  } else if (chooseZipCode.length > 0 && chooseTypeArray.length === 0) {
    searchKeyWord = ZipCodeString;
  } else if (chooseZipCode.length > 0 && chooseTypeArray.length > 0) {
    searchKeyWord = TypeString + ' or ' + ZipCodeString;
  } //console.log(searchKeyWord)


  searchProcess(searchKeyWord);
} //選擇類別


function seltTypeData() {
  var searchKeyWord = '';

  if (selectMenu.value === '熱門景點') {
    searchKeyWord = "contains(DescriptionDetail,'\u71B1\u9580')";
  } else {
    searchKeyWord = "Class1 eq '".concat(selectMenu.value, "' or Class2 eq '").concat(selectMenu.value, "' or Class3 eq '").concat(selectMenu.value, "'");
  }

  searchProcess(searchKeyWord);
} //按鈕類別


function clickTypeData() {
  if (event.target.nodeName === 'BUTTON') {
    var searchKeyWord = '';

    if (event.target.value === '熱門景點') {
      searchKeyWord = "contains(DescriptionDetail,'\u71B1\u9580')";
    } else {
      searchKeyWord = "Class1 eq '".concat(event.target.value, "' or Class2 eq '").concat(event.target.value, "' or Class3 eq '").concat(event.target.value, "'");
    }

    searchProcess(searchKeyWord);
  } else {
    return;
  }
} //換一組功能


function cheangProcess() {
  var taipeiZipCode = [100, 103, 104, 105, 106, 108, 110, 111, 112, 114, 115, 116];
  var randomZipcode = []; //把隨機的zipcod寫入randomZipcode

  while (randomZipcode.length < 4) {
    var randomNumber = Math.ceil(Math.random() * 12) - 1;

    if (randomZipcode.indexOf(taipeiZipCode[randomNumber]) == -1) {
      randomZipcode.push(taipeiZipCode[randomNumber]);
    }
  } // console.log(randomZipcode)


  var content = '';
  randomZipcode.forEach(function (item) {
    axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/Taipei?$filter=contains(ZipCode,'".concat(item, "')&$top=1&$format=JSON"), {
      headers: getAuthorizationHeader()
    }).then(function (response) {
      //渲染資料
      content += "<li class=\"swiper-slide\">\n        <a href=\"#\">\n          <img class=\"single-rounded-1 pe-md-7 bg-primary\" src=\"".concat(response.data[0].Picture.PictureUrl1, "\" alt=\"").concat(response.data[0].Name, "\">\n          <h3 class=\"text-secondary mt-2\">").concat(response.data[0].Name, "</h3>\n        <i class=\"fas fa-map-marker-alt text-secondary\"><span class=\"ps-1 text-tertiary\">").concat(zipCodeMap[response.data[0].ZipCode], "\uFF5C").concat(response.data[0].OpenTime, "</span></i>\n        </a>\n      </li>");
      showChangeClick.innerHTML = content; //console.log(content)
    })["catch"](function (error) {
      console.log(error);
    });
  });
} //把取到的值組字串並撈回資料


function searchProcess(searchKeyWord) {
  axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/Taipei?$filter=".concat(searchKeyWord, "&$top=1000&$format=JSON"), {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    //data = response.data;
    //渲染資料
    randerData(response.data);
  })["catch"](function (error) {
    console.log(error);
  });
} //授權碼記得要用在axios內


function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  var AppID = '72eedea956be46d0882b168d7657e9a1';
  var AppKey = 'CIqfhH-bYTVI-lzBqts5tjvp9P8'; //  填入自己 ID、KEY 結束

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return {
    'Authorization': Authorization,
    'X-Date': GMTString
  };
} //顯示資料


function showDataProcess(responseData) {
  var content = '';
  responseData.forEach(function (item, index) {
    content += "<div class=\"col-12 col-md-6 col-lg-3\">\n    <div class=\"card bg-transparent border-0 mb-5\">\n      <div class=\" single-rounded-8 single-rounded-lg-6 mb-2 card-box-shadow\">\n        <img src=\"".concat(item.Picture.PictureUrl1, "\"\n          class=\"card-img-top single-rounded-8 single-rounded-lg-6 w-100 bg-primary\" alt=\"...\">\n      </div>\n      <div class=\"card-body\">\n        <h3 class=\"card-title mb-2 fs-lg-4\">").concat(item.Name, "</h3>\n        <p class=\"card-text mb-4 mb-lg-2 text-light-gray fs-lg-4 ellipsis5\">\n          ").concat(item.DescriptionDetail, "\n        </p>\n        <a href=\"#\" class=\"text-success stretched-link\"># \u71B1\u9580\u666F\u9EDE</a>\n      </div>\n    </div>\n  </div> ");
  });
  displayCard.innerHTML = content;
} //渲染資料


function randerData(responseData) {
  showDataProcess(responseData);
} //功能執行
//點擊換一組功能


function changeClickProcess(e) {
  e.preventDefault();
  cheangProcess();
} //監控


searchClick.addEventListener('click', wantToGOWhere, false);
changeClick.addEventListener('click', changeClickProcess, false);
selectMenu.addEventListener('change', seltTypeData, false);
typeButton.addEventListener('click', clickTypeData, false);
advanchSearchButton.addEventListener('click', advanceChose, false); //開啟網頁後執行

cheangProcess(); //套件

var swiper = new Swiper('.siteSwiper', {
  slidesPerView: 1.3,
  freeMode: true,
  watchSlidesProgress: true,
  spaceBetween: 20,
  autoplay: {
    // delay: 2500,
    stopOnLastSlide: false,
    disableOnInteraction: true
  },
  pagination: {
    el: ".swiper-pagination"
  },
  breakpoints: {
    576: {
      slidesPerView: 2.8,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 2.5,
      spaceBetween: 20
    }
  }
}); // footer 的 go to top button:

var mybutton = document.getElementById("goTopBtn"); // When the user scrolls down 20px from the top of the document, show the button

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
} // When the user clicks on the button, scroll to the top of the document


function topFunction() {
  document.body.scrollTop = 0; // For Safari

  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
//# sourceMappingURL=all.js.map
