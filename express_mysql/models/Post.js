module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { 
         // mysql에 id 기본적으로 세팅되어있음.
         num: {
            autoIncrement:true,
            type : DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false, //필수값
            unique: true //고유값
        },

        id: {
            type:DataTypes.STRING(30), 
            allowNull: false, //필수값

        },

        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //  한글, 이모티콘(mb4) 저장
    });
    Post.associate = models => {
        /**
         * Users안에 있는 "id값"을 "user_id라는 컬럼 이름"으로 UserInfo모델에 새로운 컬럼으로 추가한다.
         */
         Post.belongsTo(models.User, {foreignKey: "id", sourceKey: 'id'});
    };

    //  Post.associate = (db) => {};
    return Post;
}