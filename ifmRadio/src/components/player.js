import comSlider from "./slider"
import { HMSToSecond, secondToHMS, DateFormat } from "../lib/utils"
//播放控制组件
const Player = {
    template: `<div class="player" id="player">
                    <div class="tingFMHtml" v-html="tingFMRadioHtml"></div>
                    <div class="cover" :class="{rotate:isPlaying}">
                        <img v-show="playStatus==1" :src="currentPlayRadio.cover"/>
                        <span v-show="playStatus==0" :class="{radioLoading:playStatus==0}">正在加载电台...</span>
                        <span v-show="playStatus==2" :class="{radioLoading:playStatus==2,error:playStatus==2}">电台无法播放或加载失败，请稍后重试或更换电台！</span>
                    </div>
                    <div class="ctrl">
                        <div class="tag">
                            <strong class="title">{{currentPlayRadio.title}}</strong>
                            <span class="artist"><span>收听人数：</span>{{currentPlayRadio.listen}}</span>
                            <span class="album limitText" :title="currentPlayRadio.desc"><span>简介：</span>{{currentPlayRadio.desc}}</span>
                            <span class="zanshang"><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/411743-ifm-%E7%BD%91%E7%BB%9C%E6%94%B6%E9%9F%B3%E6%9C%BA%E5%B9%BF%E6%92%AD%E7%94%B5%E5%8F%B0">打赏作者喝杯咖啡<svg t="1600864987392" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2566" width="24" height="24"><path d="M974.848 527.506286C963.730286 511.122286 940.617143 491.227429 893.220571 491.227429L837.924571 491.227429C838.802286 456.118857 836.461714 433.005714 836.461714 433.005714L69.632 433.005714C69.632 433.005714 53.833143 580.169143 119.369143 695.734857 160.621714 767.707429 185.490286 788.48 220.891429 824.173714 280.283429 883.858286 351.670857 883.858286 351.670857 883.858286L552.96 883.858286C552.96 883.858286 624.347429 883.858286 682.861714 825.929143 696.32 812.178286 708.900571 800.768 721.188571 787.309714 923.062857 776.192 974.262857 635.172571 980.406857 616.448 984.210286 606.208 998.253714 562.614857 974.848 527.506286L974.848 527.506286ZM916.333714 592.164571 915.163429 595.675429C914.870857 596.553143 889.709714 680.521143 778.532571 709.778286 781.165714 705.389714 783.798857 700.708571 786.724571 695.734857 811.593143 651.556571 824.758857 602.989714 831.488 559.689143L893.220571 559.689143C909.604571 559.689143 916.626286 563.492571 918.089143 565.540571 921.307429 570.221714 919.552 583.68 916.333714 592.164571L916.333714 592.164571Z" p-id="2567" fill="#d81e06"></path><path d="M855.976229 934.209829 51.843657 934.209829C3.452343 986.580114 319.166171 1019.933257 319.166171 1019.933257L588.5952 1019.933257C588.5952 1019.933257 894.888229 987.808914 855.976229 934.209829" p-id="2568" fill="#d81e06"></path><path d="M524.580571 370.395429C525.458286 373.321143 515.803429 376.832 512.585143 375.661714 415.744 314.806857 439.149714 229.961143 502.345143 167.936 550.619429 120.832 586.605714 97.133714 586.898286 22.528 586.605714 15.798857 601.234286 14.921143 603.574857 17.846857 722.651429 186.660571 455.826286 195.437714 524.580571 370.395429" p-id="2569" fill="#d81e06"></path><path d="M349.915429 370.395429C351.085714 373.321143 341.430857 376.832 338.212571 375.661714 241.371429 314.806857 264.484571 229.961143 327.972571 167.936 375.954286 120.832 411.940571 97.133714 412.233143 22.528 412.233143 15.798857 426.861714 14.921143 429.202286 17.846857 548.278857 186.660571 281.161143 195.437714 349.915429 370.395429" p-id="2570" fill="#d81e06"></path></svg></a></span>
                        </div>
                        <div class="control">
                            <div class="left">
                                <div class="rewind icon"></div>
                                <div class="playback icon" :class="{playing:isPlaying}" @click="play"></div>
                                <div class="fastforward icon"></div>
                            </div>
                            <div class="right">
                                <div class="mute icon" :class="{enable:isMute}" @click="mute"></div>
                                <slider class="volSlider" :height="7" @sliding="changeVol" @changed="changeVol" :value="defaultVolume"></slider>
                            </div>
                        </div>
                        <div class="progress">
                            <slider class="" :width="345" :height="7" :isProgress="true" :value="playProgress"></slider>
                            <div class="timer left">{{playTime}}</div>
                            <div class="timer right">{{totalTime}}</div>
                            <div v-if="false" class="playOrder right">
                                <div class="repeat icon"></div>
                                <div class="shuffle icon"></div>
                            </div>
                        </div>
                    </div>
                </div>`,
    components: {
        'slider': comSlider,
    },
    props: {
        playingRadio: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tingFMRadioHtml: "",
            currentPlayRadio: {
                id: "",
                title: this.playingRadio.title,
                cover: "",
                listen: this.playingRadio.listen,
                desc: this.playingRadio.desc,
                token: "",
                stream_m3u8: "",
                stream_qtid: ""
            },
            playProgress: 0,
            isPlaying: false,
            isMute: false,
            howler: null,
            defaultVolume: 30,
            playTime: "00:00",
            totalTime: "00:00",
            playStatus:1,//0正在加载/1正在播放/2加载失败
            playTimer:null
        }
    },
    computed: {
    },
    watch: {
        playingRadio() {
            this.resetPlay()
            this.getTingFMRadioHtml(this.playingRadio.playUrl, (resText) => {
                const footerDiv = document.getElementById("main-footer")
                const logoImg=footerDiv.querySelector("div.station-logo img")
                this.currentPlayRadio.title = this.playingRadio.title
                this.currentPlayRadio.listen = /(\d+\.\d+W)\sListens/g.test(this.playingRadio.listen) ? /(\d+\.\d+W)\sListens/g.exec(this.playingRadio.listen)[1] : this.playingRadio.listen
                //没有电台logo图片，说明该电台处于异常状态
                if(!logoImg){
                    this.errorPlay()
                }
                else{
                    const logoImgUrl = logoImg.getAttribute("src")
                    const descText = footerDiv.querySelector("div.station-description p").innerText
                    this.currentPlayRadio.cover = logoImgUrl
                    this.currentPlayRadio.desc = descText
                    if (/wndt\s*=\s*({.*});/g.test(resText)) {
                        let wndtJson = /wndt\s*=\s*({.*});/g.exec(resText)[1]
                        wndtJson = JSON.parse(wndtJson)
                        const id = /postid-(\d+)/g.test(wndtJson.class) ? /postid-(\d+)/g.exec(wndtJson.class)[1] : ""
                        this.currentPlayRadio.id = id
                    }
                    if (/token\s*=\s*"(\w+)"/g.test(resText)) {
                        const token = /token\s*=\s*"(\w+)"/g.exec(resText)[1]
                        this.currentPlayRadio.token = token
                    }
                    this.playStatus=0
                    this.getRadioInfo()
                }
                
            })
        }
    },
    methods: {
        mute() {
            if (this.isMute) { //不静音
                this.howler.mute(false)
                this.isMute = false;
            } else { //静音
                this.howler.mute(true)
                this.isMute = true;
            }
        },
        changeVol(value) {
            this.howler.volume(value / 100)
            this.defaultVolume = value
        },
        play() {
            if (this.isPlaying) { //暂停
                this.howler.pause()
                this.isPlaying = false;
            } else { //播放
                this.howler.play()
                this.isPlaying = true;
            }
        },
        getTingFMRadioHtml(uri, callback) {
            const that = this
            GM_xmlhttpRequest({
                method: "GET",
                url: uri,
                timeout: 5000,
                onload: function (r) {
                    const bodyReg = /<body[^>]*>([\s\S]*)<\/body>/;
                    const bodyCont = bodyReg.exec(r.responseText)
                    that.tingFMRadioHtml = bodyCont[0]
                    that.$nextTick(() => {
                        callback(r.responseText)
                    })
                },
                onerror: function (e) {
                    console.error(e);
                }
            });
        },
        getRadioInfo() {
            const that = this
            const uri = `https://tingfm.com/wp-json/wndt/post/${this.currentPlayRadio.id}?token=${this.currentPlayRadio.token}`
            GM_xmlhttpRequest({
                method: "GET",
                url: uri,
                headers: { "Host": "tingfm.com" },
                responseType: "json",
                timeout: 5000,
                onload: function (r) {
                    if (r.response.status == 1) {
                        const data = r.response.data
                        that.currentPlayRadio.stream_m3u8 = data.meta.stream_m3u8
                        that.currentPlayRadio.stream_qtid = data.meta.stream_qtid
                        that.howler = new Howl({
                            src: ["https://lhttp.qingting.fm/live/" + data.meta.stream_qtid + "/64k.mp3"],
                            html5: true,
                            autoplay: true,
                            volume: that.defaultVolume / 100,
                            preload: "auto",
                            xhr: {
                                method: 'GET',
                                headers: {
                                    Range: "bytes=0-",
                                    Host: "lhttp.qingting.fm"
                                },
                            },
                            onload() {
                                const totalTime = "23:59:59"
                                const currentTime = DateFormat(new Date(), "hh:mm:ss")
                                let remainingTime = HMSToSecond(totalTime) - HMSToSecond(currentTime)
                                remainingTime = secondToHMS(remainingTime)
                                that.totalTime = remainingTime
                            },
                            onloaderror(){
                                that.errorPlay()
                                that.resetPlay()
                            },
                            onplay() {
                                that.playStatus=1
                                that.isPlaying = true
                                that.playTimer=setInterval(function () {
                                    let time = that.howler.seek();
                                    that.playTime = secondToHMS(time)
                                    const totalTimeSec = HMSToSecond(that.totalTime)
                                    const playProgress = (parseInt(time) / totalTimeSec * 100).toFixed(2)
                                    that.playProgress = playProgress
                                }, 1000);
                            },
                            onplayerror(){
                                that.errorPlay()
                                that.resetPlay()
                            }
                        });
                    }
                },
                onerror: function (e) {
                    console.error(e);
                }
            });
        },
        resetPlay(){
            this.isPlaying = false;
            clearInterval(this.playTimer);
            this.howler && this.howler.unload()
        },
        errorPlay(){
            this.playStatus=2
        }
    }

}
export default Player