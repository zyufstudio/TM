import scrollTop from "../lib/scrollTo"

const PlayerList = {
    template: `<div class="playList" id="playerList">
             <div class="tingFMHtml" v-html="tingFMHtml"></div>
                <div class="list">
                    <div class="genreList"><ul><li v-for="item in genreList" :class="{active:item.isActive}" @click="getGenreRadio(item)"><span>{{item.title}}</span></li></ul></div>
                    <div class="radioList" ref="radioList">
                        <ul>
                            <li v-for="item in playList">
                                <span class="radioName" @click="playRadio(item)">{{item.title}}</span>
                                <span class="listen">{{item.listen}}</span>
                            </li>
                        </ul>
                        <div v-if="loadingRadioList" class="loadRadioList"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>
                    </div>
                    <div class="page"><span class="prev" :class="{marginRight:page.nextUrl!=''}" v-if="page.prevUrl!=''" @click="getGenreRadioList(page.prevUrl)">上一页</span><span class="next" v-if="page.nextUrl!=''" @click="getGenreRadioList(page.nextUrl)">下一页</span></div>
                    <div class="dataCopyright"><span>数据版权声明：本脚本的数据来源于<a href="https://tingfm.com" target="_blank">TingFM</a>，数据版权归TingFM所有。</span></div>
                </div>
             </div>`,
    created() {
        this.getGenreList()
    },
    data() {
        return {
            tingFMHtml: "",
            genreList: [],
            playList: [],
            page: {
                nextUrl: "",
                prevUrl: ""
            },
            loadingRadioList: false
        }
    },
    methods: {
        getGenreList() {
            this.getTingFMHtml("https://tingfm.com/radio", () => {
                const radioDiv = document.getElementById("wrap")
                //电台分类
                const radioGenre = radioDiv.querySelector("ul.tab")
                const genreList = radioGenre.getElementsByTagName("li")
                for (let index = 0; index < genreList.length; index++) {
                    const item = genreList[index];
                    const link = item.querySelector("a")
                    let id = link.getAttribute("data-value");
                    id = id == "" ? "all" : id;
                    const genreUrl = link.getAttribute("href");
                    const genreText = link.innerText;
                    this.genreList.push({
                        id: id,
                        title: genreText,
                        url: genreUrl,
                        isActive: false
                    });
                }
                const genreRadioUrl = this.genreList[0].url
                this.genreList[0].isActive = true
                this.getGenreRadioList(genreRadioUrl,true)

            });
        },
        playRadio(radioItem) {
            this.$emit("play-radio", radioItem)
        },
        getGenreRadio(genreItem) {
            this.genreList.forEach(item => {
                if (item.id == genreItem.id) {  //选中流派
                    const genreRadioUrl = genreItem.url
                    this.getGenreRadioList(genreRadioUrl)
                    item.isActive = true
                } else {
                    item.isActive = false
                }
            });
        },
        getTingFMHtml(uri, callback) {
            const that = this
            GM_xmlhttpRequest({
                method: "GET",
                url: uri,
                timeout: 5000,
                onload: function (r) {
                    const bodyReg = /<body[^>]*>([\s\S]*)<\/body>/;
                    const bodyCont = bodyReg.exec(r.responseText)
                    that.tingFMHtml = bodyCont[0]
                    that.$nextTick(() => {
                        callback(r.responseText)
                    })
                },
                onerror: function (e) {
                    console.error(e);
                }
            });
        },
        //获取电台列表
        getGenreRadioList(radioUrl,isInitPlay=false) {
            this.loadingRadioList = true
            this.getTingFMHtml(radioUrl, (resText) => {
                this.playList = []
                const radioDiv = document.getElementById("filter-results")
                const pageNext = radioDiv.querySelector("a.pagination-next")
                const pagePrev = radioDiv.querySelector("a.pagination-previous")
                this.page.nextUrl = ""
                this.page.prevUrl = ""
                //this.$refs.radioList.scrollTop = 0
                scrollTop(this.$refs.radioList, 0, 500)
                if (pageNext) {
                    const url = pageNext.getAttribute("href")
                    this.page.nextUrl = url
                }
                if (pagePrev) {
                    const url = pagePrev.getAttribute("href")
                    this.page.prevUrl = url
                }
                //电台列表
                const radioList = radioDiv.querySelectorAll("div.radio-list")
                for (let index = 0; index < radioList.length; index++) {
                    const item = radioList[index];
                    const radio = item.querySelector("h3.is-pulled-left")
                    const link = radio.querySelector("a")
                    const radioUrl = link.getAttribute("href");
                    const radioName = link.innerHTML
                    const listen = item.querySelector("span.is-pulled-right").innerHTML
                    this.playList.push({
                        title: radioName,
                        listen: listen,
                        playUrl: radioUrl
                    })
                    this.loadingRadioList = false
                    if(isInitPlay){
                        const firstRadioItem=this.playList[0]
                        this.$emit("play-radio", firstRadioItem)
                    }
                }
            })
        }
    }
}
export default PlayerList