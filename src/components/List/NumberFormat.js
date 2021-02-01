export const formatBytes = (bytes, decimals) => {
    if (bytes === 0) return '0 Bytes';
    var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatNumber = (x) => {
    if(x === 0) return "";
    var k = 1000,
        sizes = ["", "K", "M", "B", "T"],
        i = Math.floor(Math.log(x) / Math.log(k));
    
    return parseFloat((x / Math.pow(k, i)).toFixed(1)) + sizes[i];
}