module.exports = class Ulti
{

    /**
     * Kiểm tra xem 1 Type có phải là class hay không
     * @param {*} classType 
     * @returns 
     */
    static isClass(classType)
    {
        //Điều kiện là 1 class, nó là 1 function và có hàm constructor
        return typeof classType === 'function' && /^\s*class\s+/.test(classType.toString());
    }

    static getRandom(max, min = 0)
    {
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**
     * Lấy danh sách các class theo dạng url
     * @param {} obj 
     * @param {*} parentName 
     * @param {*} result 
     * @returns 
     */
    static getListUrl(obj, result = [])
    {

        if ((obj.isControl && obj.isControl === true))
        {
            result.push({ name: obj.title, url: obj.url });
            return result;
        }

        let names = Object.keys(obj);

        names.forEach(element =>
        {
            return Ulti.getListUrl(obj[element], result);
        });

        return result;
    }

    /**
     * Chuyển tất cả value các thuộc tính của object thành kiểu Number nếu có thể
     * @param {} obj 
     * @returns 
     */
    static convertIntObj(obj)
    {
        const res = {};
        for (const key in obj)
        {
            res[key] = {};
            for (const prop in obj[key])
            {
                const parsed = parseInt(obj[key][prop], 10);
                res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
            }
        }
        return res;
    }

    static validFolderName(data)
    {
        return data.replace(/[^a-zA-Z0-9\-\\/_\\.]/g, '');
    }

    static validFileName(data)
    {
        return data.replace(/[^a-zA-Z0-9\-\\]/g, '');
    }
    /**
     * Xó kỹ tự
     * @param {
     * Type =1 : Giữ lại số nguyên dương
     * Type = 2: Giữ lại số Thực
     * Type = 3: Xóa hết ký tự đặc biệt chỉ giữ lại số và chữ
     * } type 
     * @param {*} data 
     * @returns 
     */
    static removeCharacter(type, data)
    {
        //Chỉ giữ lại số nguyên dương
        if (type === 1)
        {
            return data.replace(/\D/g, '');
        }
        //Giữ lại số float
        else if (type === 2)
        {
            return data.replace(/[^0-9.-]/g, '');
        }
        //remove tất cả ký tự đặc biệt
        else if (type === 3)
        {
            return data.replace(/[^a-zA-Z0-9]/g, '');
        }
        return data;
    }
    static removeVietNamSign(str)
    {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');

        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        return str;
    }

    static generatePassword(length)
    {
        let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&*',
            retVal = '';
        for (let i = 0, n = charset.length; i < length; ++i)
        {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    static generateKey(length)
    {
        let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            retVal = '';
        for (let i = 0, n = charset.length; i < length; ++i)
        {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    static parseCookie(value, other)
    {
        //Dịnh dang của cookie sẽ là: sb=dIGWZALP9Jc_Ex-DDItiOeSS;wd=1920x937;
        let arr = value.split(';');
        let cookies = [];
        for (let i = 0; i < arr.length; i++)
        {
            let arrItem = arr[i].trim().split('=');

            if (arrItem.length === 2)
            {
                cookies.push({
                    name: arrItem[0],
                    value: arrItem[1],
                    ...other
                });
            }
        }
        return cookies;
    }

    
    static sleep(time)
    {
        return new Promise(function (resolve)
        {
            setTimeout(resolve, time);
        });
    }
};