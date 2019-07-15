import Scroll from '../packages/scroll-core/src/index';

const appDom = document.getElementById('app');
// const scrolltopDom = document.getElementById('scrolltop');
const scroll = new Scroll('#container', {
    unlimitedScroll: 'damping',
    damping: {
        top: 100,
        bottom: 50
    }
});

scroll.onReachStart((...args) => {
    console.log('onReachStart', args);
});

scroll.onReachEnd((...args) => {
    console.log('onReachEnd', args);
});
scroll.onLoading((...args) => {
    console.log('onLoading', args);
});
scroll.onPullRefresh((...args) => {
    console.log('onPullRefresh', args);
});

scroll.onOverScroll((...args) => {
    console.log('onOverScroll', args);
});
