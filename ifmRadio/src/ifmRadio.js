import {
    DateFormat
} from "./lib/utils"
import comPlayer from "./components/player"
import comPlayerList from "./components/playList"

//主程序
const iFMRadio = function () {
    const $doc = document;
    const bodyEl = document.getElementsByTagName("body")[0];
    const headEl = document.getElementsByTagName("head")[0];
    const randomCode = DateFormat(new Date(), "yyMM").toString() + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString(); //属性随机码，年月加六位随机码。用于元素属性后缀，以防止属性名称重复。
    function createStyle() {
        const style = 'iFMStyle'
        GM_addStyle(style)
    }

    function RegMenu() {
        GM_registerMenuCommand("iFM", function () {
            bodyEl.innerHTML = ""
            headEl.innerHTML = "";
            headEl.innerHTML = "<title>iFM-网络收音机广播电台</title>";
            let iFMDiv = document.createElement("div");
            iFMDiv.id = `ifm${randomCode}`;
            document.body.appendChild(iFMDiv);
            createStyle();
            createIFM();
        });
    }

    const comMain = {
        template: `<div id="ifm${randomCode}">
                <player :playing-radio="playingRadioItem"></player>
                <player-list @play-radio="playRadio"></player-list>
            </div>`,
        components: {
            'PlayerList': comPlayerList,
            'Player': comPlayer
        },
        data() {
            return {
                playingRadioItem: {
                    title: 'iFM-网络收音机广播电台',
                    listen:'0',
                    playUrl:'',
                    desc:"FM网络收音机，广播电台在线收听"
                }
            }
        },
        methods: {
            playRadio(radioItem) {
                let { title, listen, playUrl } = radioItem;
                const item={
                    title,listen,playUrl,desc:""
                }
                this.playingRadioItem=item
            }
        }
    }

    function createIFM() {
        new Vue({
            el: `#ifm${randomCode}`,
            render: h => h(comMain)

        })
    }
    this.init = function () {
        RegMenu();
    }
}
const iFM = new iFMRadio();
iFM.init();