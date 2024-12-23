

interface messeageInterface {
    arabic: {}
    english: {}
    persian: {}
}


let messages: any = {
    arabic: {
        tokenError: "انتهت صلاحية الرمز",
        emailError: "البريد الإلكتروني غير موجود!",
        codeError: "رمز خاطئ!",
        unknownError: "حدث خطأ ما . . .",
        userNotFound : 'المستخدم غير موجود في قاعدة البيانات'
    },
    english: {
        tokenError: "Token expired",
        emailError: "Email not found!",
        codeError: "Wrong code!",
        unknownError: "Something went wrong . . .",
        userNotFound : 'this user is not exist on database'
    },
    persian: {
        tokenError: "توکن منقضی شده است",
        emailError: "ایمیل یافت نشد!",
        codeError: "کد نادرست است!",
        unknownError: "یک خطا رخ داده است . . .",
        userNotFound : 'این کاربر در پایگاه داده وجود ندارد'
    }
}


export default messages;