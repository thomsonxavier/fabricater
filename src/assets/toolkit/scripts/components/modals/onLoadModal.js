export const onLoadModal = () => {
    let onLoadModalBtn = document.querySelectorAll('.-onLoadModal') || null;
    if(!onLoadModalBtn) {
        return;
    }
    onLoadModalBtn.forEach(btn=>{
        btn.dispatchEvent(new Event('click'));
    })
}