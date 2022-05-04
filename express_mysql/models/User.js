//models/user.js
module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User', { // MySQL에는 users라는 테이블 생성
        id: {
            type:DataTypes.STRING(30), 
            primaryKey: true,
            allowNull: false, //필수값
            unique: true //고유값
        },
        email: {
            type:DataTypes.STRING(30), 
           // 자주사용되는 자료형 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME   
            allowNull: false, //필수값
            unique: true //고유값
        },
        nickname: {
            type:DataTypes.STRING(30),
            allowNull: false, //필수값
        },
        password: {
            // 패스워드는 암호화를 하기 때문에 넉넉하게 잡아주는 것이 좋다. 
            type:DataTypes.STRING(100),
            allowNull: false, //필수값
        },
    },{
        // 한글을 쓸수 있게 해준다.(한글 저장) 
        charset: 'utf8',
        collate: 'utf8_general_ci' 
    });
    User.associate = models => {
        /**
         * Users안에 있는 "id값"을 "user_id라는 컬럼 이름"으로 UserInfo모델에 새로운 컬럼으로 추가한다.
         */
        User.hasOne(models.Post, {foreignKey: "id", sourceKey: 'id'});
    };

    //  User.associate = (db) => {};
    return User;
}