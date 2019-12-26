
--IF EXISTS (SELECT * FROM TABLES
--           WHERE TABLE_NAME = 'TB_ITCUST')
--BEGIN
--  drop table TB_ITCUST
--END
--ELSE

--create sequence

CREATE SEQUENCE SEQ_INQLOG
  MINVALUE 00001
  MAXVALUE 99999
  START WITH 00001
  INCREMENT BY 1 CYCLE
  CACHE 20;
 
  
CREATE TABLE TB_ITCUST (
             CUST_GB      VARCHAR2(2) NOT NULL PRIMARY KEY,
             CUST_CD      VARCHAR2(10) NOT NULL,
             CUST_NM      VARCHAR2(100) ,
             CUST_NM_ENG  VARCHAR2(100),
             BRANCH_NM    VARCHAR2(100),
             BRANCH_NM_ENG   VARCHAR2(100),
             CO_RGST_NO      VARCHAR2(30),
             BIZ_CG_CD       VARCHAR2(2),
             PRT_CUST_GB     VARCHAR2(2),
             PRT_CUST_CD     VARCHAR2(10),
             ADDR            VARCHAR2(1000),
             VALID_START_DT  VARCHAR2(8),
             VALID_END_DT    VARCHAR2(8),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_ITCUST IS 'customer institution code management table';
    
--CREATE TABLESPACE admin_tbs 
--   DATAFILE 'tbs1_data.dbf' 
--   SIZE 1m;
--ALTER DATABASE 
--DATAFILE 'tbs1_data.dbf' 
--RESIZE 1000M;
-- CONSTRAINT admin_dept_fkey REFERENCES hr.departments
--                         (department_id)

--ITCTRT
   CREATE TABLE TB_ITCTRT (
             CUST_GB      VARCHAR2(2) NOT NULL,
             CUST_CD      VARCHAR2(10) NOT NULL,
             GDS_CD       VARCHAR2(5) NOT NULL PRIMARY KEY,
             VALID_START_DT  VARCHAR2(8),
             VALID_END_DT    VARCHAR2(8),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20) 
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_ITCTRT IS 'Contract product management by customer table';
    
--  ITCODE  
CREATE TABLE TB_ITCODE (
             CODE      VARCHAR2(50) NOT NULL PRIMARY KEY,
             CD_CLASS      VARCHAR2(5) NOT NULL,
             VALID_START_DT  VARCHAR2(8),
             VALID_END_DT    VARCHAR2(8),
             CODE_NM      VARCHAR2(300) ,
             CODE_NM_EN  VARCHAR2(300),
             PRT_CD_CLASS    VARCHAR2(5),
             PRT_CODE   VARCHAR2(50),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_ITCODE IS 'All code management table';
    
    --  ITUSER  
CREATE TABLE TB_ITUSER (
             USER_ID      VARCHAR2(20) NOT NULL PRIMARY KEY,
             USER_NM      VARCHAR2(50) NOT NULL,
             CUST_CD      VARCHAR2(10) NOT NULL,
             INOUT_GB     VARCHAR2(1) NOT NULL,
             UESR_PW      VARCHAR2(100) NOT NULL,
             VALID_START_DT  VARCHAR2(8),
             VALID_END_DT    VARCHAR2(8),
             TEL_NO_MOBILE      VARCHAR2(200) ,
             ADDR            VARCHAR2(1000),
             EMAIL    VARCHAR2(200),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_ITUSER IS 'Internal and external user management table';

    --  CAPTCHA_RSP  
CREATE TABLE TB_CAPTCHA_RSP (
             CAPTCHA_USER_ID      VARCHAR2(20) NOT NULL PRIMARY KEY,
             CAPTCHA_USER_NM      VARCHAR2(50) NOT NULL,
             VALID_START_DT  VARCHAR2(8),
             VALID_END_DT    VARCHAR2(8),
             TEL_NO_MOBILE      VARCHAR2(200) ,
             ADDR            VARCHAR2(1000),
             EMAIL    VARCHAR2(200),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_CAPTCHA_RSP IS 'CAPTCHA username management table';

--SCRPLOG
CREATE TABLE TB_SCRPLOG (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             CUST_SSID_ID      VARCHAR2(20),
             CUST_CD      VARCHAR2(10),
             GDS_CD      VARCHAR2(5) ,
             LOGIN_ID      VARCHAR2(2000) NOT NULL,
             LOGIN_PW      VARCHAR2(2000) NOT NULL,
             NATL_ID    VARCHAR2(50),
             OLD_NATL_ID     VARCHAR2(50),
             CUST_ID  VARCHAR2(50),
             TAX_ID    VARCHAR2(50),
             PSPT_NO    VARCHAR2(50),
             OTR_ID   VARCHAR2(50),
             CIC_ID      VARCHAR2(80),
             CIC_USED_ID    VARCHAR2(1),
             CIC_GDS_CD       VARCHAR2(5),
             PSN_NM     VARCHAR2(800),
             TEL_NO_MOBILE      VARCHAR2(200),
             INQ_DTIM     VARCHAR2(14),
             AGR_FG            VARCHAR2(1),
             SCRP_STAT_CD  VARCHAR2(2),
             RSP_CD    VARCHAR2(4),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_SCRPLOG IS 'Scraping request management table';
--    crate tringger sysDtim auto genrate
CREATE OR REPLACE TRIGGER date_trigger

BEFORE INSERT

ON TB_SCRPLOG

REFERENCING NEW AS NEW

FOR EACH ROW

BEGIN

SELECT TO_CHAR(sysdate, 'yyyyMMddHHMMSS') INTO :NEW.SYS_DTIM FROM dual;

END;    
    
--INQLOG
CREATE TABLE TB_INQLOG (
             INQ_LOG_ID       VARCHAR2(20) NOT NULL PRIMARY KEY,
             CUST_CD      VARCHAR2(10),
             TX_GB_CD      VARCHAR2(30),
             NATL_ID  VARCHAR2(50),
             TAX_ID    VARCHAR2(50),
             OTR_ID   VARCHAR2(200),
             CIC_ID      VARCHAR2(80),
             INQ_DTIM     VARCHAR2(14),
             RSP_CD    VARCHAR2(4),
             AGR_FG            VARCHAR2(1),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_INQLOG IS 'All reports of request to NICE management table';

--CICRPT_MAIN
CREATE TABLE TB_CICRPT_MAIN (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             INQ_OGZ_NM      VARCHAR2(500),
             INQ_OGZ_ADDR      VARCHAR2(30),
             INQ_USER_NM  VARCHAR2(1000),
             INQ_CD    VARCHAR2(10),
             INQ_DTIM   VARCHAR2(14),
             RPT_SEND_DTIM      VARCHAR2(20),
             PSN_NM     VARCHAR2(800),
             CIC_ID      VARCHAR2(80),
             PSN_ADDR            VARCHAR2(1000),
             CUST_ID  VARCHAR2(50),
             OTR_IDEN_EVD    VARCHAR2(200),
             EWS_GRD   VARCHAR2(10),
             BIRTH_YMD      VARCHAR2(8),
             TEL_NO_MOBILE      VARCHAR2(200),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_CICRPT_MAIN IS 'CIC report main information table';
    
--SMS_TRGT
CREATE TABLE TB_SMS_TRGT (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             CUST_SSID__ID      VARCHAR2(10),
             CUST_CD      VARCHAR2(10) NOT NULL,
             GDS_CD      VARCHAR2(5) ,
             CUST_ID  VARCHAR2(50),
             TAX_ID    VARCHAR2(50),
             OTR_ID   VARCHAR2(50),
             CIC_ID      VARCHAR2(80),
             CIC_GDS_CD       VARCHAR2(5),
             PSN_NM     VARCHAR2(800),
             TEL_NO_MOBILE      VARCHAR2(200) ,
             REQ_DTIM      VARCHAR2(14),
             SMS_STAT_CD     VARCHAR2(2),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_SMS_TRGT IS 'Message receiver management table';
    
--CIC_MRPT
CREATE TABLE TB_CIC_MRPT (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             SCORE      VARCHAR2(5),
             GRADE      VARCHAR2(10),
             BASE_DATE      VARCHAR2(8) ,
             CC_BAL  NUMBER(22, 3),
             REL_OGZ_LIST    VARCHAR2(2000)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_CIC_MRPT IS 'CIC mobile credit report table';
    
--LOAN_DETAIL
CREATE TABLE TB_LOAN_DETAIL (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             SEQ      NUMBER(5),
             LOAD_DATE      VARCHAR2(8),
             LOAD_TIME      VARCHAR2(6) ,
             OGZ_CD_NM  VARCHAR2(500),
             RCT_RPT_DATE    VARCHAR2(8),
             ST_LOAN_VND   NUMBER(22,3),
             ST_LOAN_USD      NUMBER(22,3),
             NORM_LOAN_VND       NUMBER(22,3),
             NORM_LOAN_USD    NUMBER(22,3),
             CAT_LOAN_VND      NUMBER(22,3),
             CAT_LOAN_USD      NUMBER(22,3),
             FIX_LOAN_VND     NUMBER(22,3),
             FIX_LOAN_USD        NUMBER(22,3),
             CQ_LOAN_VND      NUMBER(22,3),
             CQ_LOAN_USD       NUMBER(22,3),
             EL_LOAN_VND    NUMBER(22,3),
             EL_LOAN_USD    NUMBER(22,3),
             MT_LOAN_VND    NUMBER(22,3),
             MT_LOAN_UDS    NUMBER(22,3),
             LT_LOAN_VND    NUMBER(22,3),
             LT_LOAN_USD    NUMBER(22,3),
             OTR_LOAN_VND      NUMBER(22,3),
             OTR_LOAN_USD      NUMBER(22,3),
             OTR_BAD_LOAN_VND     NUMBER(22,3),
             OTR_BAD_LOAN_USD        NUMBER(22,3),
             OGZ_TOT_LOAN_VND       NUMBER(22,3),
             OGZ_TOT_LOAN_USD    NUMBER(22,3),
             SUM_TOT_OGZ      NUMBER(22,3),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_LOAN_DETAIL IS 'Credit details (repeat)';
    
--CRDT_CARD
CREATE TABLE TB_CRDT_CARD (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             CARD_TOT_LMT      NUMBER(22,3),
             CARD_TOT_SETL_AMT      NUMBER(22,3),
             CARD_TOT_ARR_AMT      NUMBER(22,3),
             CARD_CNT  NUMBER(10),
             CARD_ISU_OGZ    VARCHAR2(500),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_CRDT_CARD IS 'Credit card information';
    
--VAMC_LOAN
CREATE TABLE TB_VAMC_LOAN (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             SEQ      NUMBER(5),
             SELL_OGZ_NM     VARCHAR2(500),
             PRCP_BAL      NUMBER(22,3),
             DATA_RPT_DATE   VARCHAR2(8),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_VAMC_LOAN IS 'VAMC sale credit (repeat) table';

--LOAN_12MON
CREATE TABLE TB_LOAN_12MON (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             SEQ      NUMBER(5),
             BASE_MONTH     VARCHAR2(6),
             BASE_MONTH_BAL      NUMBER(22,3),
             BASE_MONTH_CARD_BAL      NUMBER(22,3),
             BASE_MONTH_SUM      NUMBER(22,3),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_LOAN_12MON IS 'Credit changes in the last 12 months (repeat) table';

--NPL_5YR
CREATE TABLE TB_NPL_5YR (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             SEQ      NUMBER(5),
             OGZ_NM_BRANCH_NM     VARCHAR2(500),
             RCT_OCR_DATE      VARCHAR2(8),
             DEBT_GRP      VARCHAR2(10),
             AMT_VND      NUMBER(22,3),
             AMD_USD      NUMBER(22,3),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_NPL_5YR IS 'Bad debt in the last 5 years (repeat) table';
    
--CRDT_CARD_DEQ
CREATE TABLE TB_CRDT_CARD_DEQ (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             CARD_ARR_PSN_YN      VARCHAR2(1),
             CARD_ARR_LGST_DAYS     NUMBER(10),
             CARD_ARR_CNT      NUMBER(10),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_CRDT_CARD_DEQ IS 'Credit card overdue information in the last 3 years table';
    
--LOAN_12MON_PC
CREATE TABLE TB_LOAN_12MON_PC (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             SEQ      NUMBER(5),
             BASE_MONTH     VARCHAR2(6),
             BASE_MONTH_CAT_LOAN_SUM     NUMBER(22,3),
             OGZ_NM      VARCHAR2(500),
             RPT_DATE      VARCHAR2(8),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_LOAN_12MON_PC IS 'Credit blacklist information in the last 12 months (repeat) table';
    
--LOAN_GURT
CREATE TABLE TB_LOAN_GURT (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             AST_SCRT_LOAN_GURT_AMT      NUMBER(22,3),
             SCRT_AST_CNT     NUMBER(10),
             SCRT_AST_OGZ_CNT     NUMBER(10),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_LOAN_GURT IS 'Credit guarantee information table';
    
--FINL_CTRT
CREATE TABLE TB_FINL_CTRT (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             FIN_CTRT      VARCHAR2(50),
             OGZ_NM     VARCHAR2(500),
             CTRT_START_DATE     VARCHAR2(8),
             CTRT_END_DATE  VARCHAR2(8),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_FINL_CTRT IS 'Financial contract information table';
    
--INQ_FINL_LST
CREATE TABLE TB_INQ_FINL_LST (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             OGZ_NM_BRANCH_NM      VARCHAR2(500),
             OGZ_CD     VARCHAR2(50),
             INQ_GDS    VARCHAR2(50),
             INQ_DATE     VARCHAR2(8),
             INQ_TIME  VARCHAR2(6),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_INQ_FINL_LST IS 'Financial institution inquiring customer information table';
    
--LOAN_ETC
CREATE TABLE TB_LOAN_ETC (
             NICE_SSIN_ID       VARCHAR2(25) NOT NULL PRIMARY KEY,
             OTR_INFO_PSN      VARCHAR2(1000),
             SYS_DTIM        VARCHAR2(14) NOT NULL,
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_LOAN_ETC IS 'Financial institution inquiring customer information table';
    
--SCRP_TRLOG
CREATE TABLE TB_SCRP_TRLOG (
             SCRP_LOG_ID       VARCHAR2(20) NOT NULL PRIMARY KEY,
             NICE_SSIN_ID       VARCHAR2(25) ,
             S_SVC_CD      VARCHAR2(50),
             S_USER_ID      VARCHAR2(50),
             S_USER_PW      VARCHAR2(50) ,
             S_CUSTOMER_TYPE      VARCHAR2(50),
             S_CIC_NO      VARCHAR2(50),
             S_TAX_NO    VARCHAR2(50),
             S_CMT_NO     VARCHAR2(50),
             S_REPORT_TYPE  VARCHAR2(50),
             S_VOTE_NO    VARCHAR2(50),
             S_REQ_STATUS    VARCHAR2(50),
             S_INQ_DT1   VARCHAR2(50),
             S_INQ_DT2      VARCHAR2(50),
             S_STEP_INPUT    VARCHAR2(50),
             S_STEP_DATA       VARCHAR2(1000),
             S_DTIM     VARCHAR2(14),
             R_ERRYN      VARCHAR2(50),
             R_ERRMSG     VARCHAR2(100),
             R_STEP_IMG        VARCHAR2(1000),
             R_STEP_DATA  VARCHAR2(1000),
             R_DTIM    VARCHAR2(14),
             WORK_ID         VARCHAR2(20)
--              CONSTRAINT admin_scrplog_fkey REFERENCES TB_ITUSER
--                         (USER_ID)
                        )
       TABLESPACE admin_tbs
       STORAGE ( INITIAL 50K);
    
    COMMENT ON TABLE TB_SCRP_TRLOG IS 'All scraping transaction logging table';
