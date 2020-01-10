export default {
    data () {
        return {
            // 采用对象的形式，防止有其他变化，比如必填、非必填。。
            fieldsConfig: {
                forestOwnershipCertifi: { enable: false },
                equityPerson: { enable: false },
                keeper: { enable: false },
                keepTime: { enable: false },
                biography: { enable: false },
            }
        }
    },
    methods: {
        getFieldIsEnable (fName) {
            return !!this.fieldsConfig[fName] && this.fieldsConfig[fName].enable
        },
        getSeedlingDetailTpl () {
            return {
                baseNumber: '',
                massifId: '',
                unitKey: '',
                nameKey: '',
                nurseryStockName: '',
                age: 0,
                num: 0,
                plantTime: '',
                position: '',
                coordinate: '',
                biography: '',
                landOptions: [],

                forestOwnershipCertifi: '', // 林权证号
                equityPerson: '', // 权益人
                keeper: '', // 守护人
                keepTime: [], // 守护时间（keepStartTime + keepEndTime）
            }
        },
    },
    created () {
        this.http.get(this.api.seedling.fieldConfigInfo).then(res => {
            if (res.code !== 200) {
                return
            }

            /**
             -- auto-generated definition
             create table fmp_nursery_config
             (
             id                            bigint auto_increment
             primary key,
             org_id                        bigint               not null comment '企业id',
             equity_person_show            tinyint(2) default 1 not null comment '权益人是否显示（0否，1是）',
             keeper_show                   tinyint(2) default 1 not null comment '守护人是否显示（0否，1是）',
             forest_ownership_certifi_show tinyint(2) default 1 not null comment '林权证号是否显示（0否，1是）',
             keep_time_show                tinyint(2) default 1 not null comment '守护时间是否显示（0否，1是）',
             biography_show                tinyint(2) default 1 not null comment '传记是否显示（0否，1是）'
             )
             comment '苗木配置';


             biographyShow: 1
             equityPersonShow: 1
             forestOwnershipCertifiShow: 1
             id: "1"
             keepTimeShow: 0
             keeperShow: 0
             orgId: "60207727804678146"
             */

            res = res.nurseryConfig

            // 添加一个钩子
            if (this.afterGetFieldConfig) {
                this.afterGetFieldConfig(res)
            }

            const { fieldsConfig } = this
            ;[
                ['forestOwnershipCertifiShow', 'forestOwnershipCertifi'],
                ['equityPersonShow', 'equityPerson'],
                ['keeperShow', 'keeper'],
                ['keepTimeShow', 'keepTime'],
                ['biographyShow', 'biography']
            ].forEach(item => {
                fieldsConfig[item[1]].enable = !!res[item[0]]
            })
        })
    },
}
