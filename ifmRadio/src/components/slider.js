//滑块组件
const Slider = {
    template: `<div class="slider" ref="slider" :style="sliderStyle">
                    <div class="slider_bar" @click="isSlider && onSliderClick($event)" :style="barStyle">
                        <div class="slider_progress" ref="slider_progress" :style="progressStyle"></div>
                        <div v-show="isSlider" class="slider_dot" ref="slider_dot" :style="dotStyle" @mousedown="isSlider && onDotDown($event)"></div>
                    </div>
                </div>`,
    mounted() {
        this.sliderEl = this.$refs.slider;
        this.dotEl = this.$refs.slider_dot;
        this.barEl = this.$refs.slider_dot.parentElement;
        this.progressEl = this.$refs.slider_progress;
        this.restWidth = this.barEl.offsetWidth - this.dotEl.offsetWidth;
        this.$nextTick(()=>{
            this.dotValue=this.RTValue-this.dotEl.offsetWidth / 2
        })
    },
    props: {
        width: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 10
        },
        isProgress: {   //是否作为进度条组件
            type: Boolean,
            default: false
        },
        value: { //进度条默认百分比(适用滑块和进度条)
            type: Number,
            default: 0,
            validator: val => val >= 0 && val <= 100
        }
    },
    data() {
        return {
            RTValue:this.value,
            dotValue:0,
            startX: 0,
            startPosition: 0,
            restWidth: 0,
            progressEl: null,
            dotEl: null,
            barEl: null,
            sliderEl: null
        }
    },
    watch:{
        value(){
            this.RTValue=this.value
        }
    },
    computed: {
        barStyle() {
            return {
                width: this.width + "px",
                height: this.height + "px"
            }
        },
        sliderStyle() {
            return {
                width: this.width + "px",
                height: this.height + "px",
                cursor: !this.isSlider ? "auto" : "pointer"
            }
        },
        progressStyle() {
            return {
                width: this.RTValue + '%'
            }
        },
        dotStyle(){
            return {
                left: this.dotValue + 'px'
            }
        },
        isSlider() {
            let bl = true;
            if (this.isProgress) {
                bl = false
            }
            return bl
        },
    },
    methods: {
        onSliderClick(event) {
            let left = event.clientX - this.getElementLeft(this.sliderEl) - this.dotEl.offsetWidth / 2
            if (left < 0) {
                left = 0
            }
            if (left >= this.restWidth) {
                left = this.restWidth
            }
            this.dotValue = left
            let bili = left / this.restWidth * 100
            const value = this.width * Math.ceil(bili) / 100
            this.RTValue = value
            this.$emit("changed", value)
        },
        onDotDown(event) {
            let e = event || window.event
            e.preventDefault();
            this.startPosition = this.dotEl.offsetLeft
            this.startX = e.clientX
            document.addEventListener('mousemove', this.onDragging);
            document.addEventListener('mouseup', this.onDragEnd);
        },
        onDragging(event) {
            let e = event || window.event
            // 浏览器当前位置减去鼠标按下的位置
            let moveL = e.clientX - this.startX //鼠标移动的距离  
            let newL = this.startPosition + moveL //left值
            // 判断最大值和最小值
            if (newL < 0) {
                newL = 0
            }
            if (newL >= this.restWidth) {
                newL = this.restWidth
            }
            // 改变left值
            this.dotValue = newL
            // 计算比例
            let bili = newL / this.restWidth * 100
            const value = this.width * Math.ceil(bili) / 100
            this.RTValue = value
            this.$emit("sliding", value);
        },
        onDragEnd() {
            document.removeEventListener('mousemove', this.onDragging);
            document.removeEventListener('mouseup', this.onDragEnd);
        },
        getElementLeft(element) {
            let actualLeft = element.offsetLeft;
            let current = element.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        }
    }
}

export default Slider