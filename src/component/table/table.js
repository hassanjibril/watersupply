import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { userSelector } from '../../actions/users';
import { API } from 'aws-amplify';

import MaterialTable from 'material-table';
import { createOrg, deleteOrg, loadOrgs } from '../../actions/orgs';
import { deleteUser, loadUsers } from '../../actions/users';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import { useTranslate } from "react-translate";

const useStyles = makeStyles(theme => ({
    addBtn: {
        margin: theme.spacing(2,1,1,0),
        float: "right",
        zIndex: 1
    }
}));

function EnhancedTable({
    isUserTable,
    isMemberTable,
    columns,
    data,
    deleteOrg,
    loadOrgs,
    deleteUser,
    getUser,
    loadUsers,
    history,
    lang
}) {
    const classes = useStyles();
    let t = useTranslate("Member");
    const handleCellClick = (event, row) => {
        history.push(`/editMember/${row.id}`)
    }
    return (
        <div>
            <Button 
                variant="contained" 
                color="primary" 
                className={classes.addBtn}
                onClick={()=>{
                    history.push('editMember/new');
                }}
            >
                {t(`add_member_btn-${lang}`)}
            </Button>
            <MaterialTable
                title={isUserTable ? t(`member_title-${lang}`) : "Organizations"}
                columns={columns}
                data={data}
                onRowClick={handleCellClick}
                editable={ !isMemberTable ? {
                    onRowDelete: async oldData => {
                        if(!isUserTable) {
                            await deleteOrg(oldData.id);
                            await loadOrgs();
                        }
                        else {
                            const delEmail = await getUser(oldData.id).email;
                            await deleteUser(oldData.id);
                            API.post('headwater', `/user/delete`, {
                                body: {
                                    username: delEmail
                                }
                            });
                            await loadUsers();
                        }
                    }
                } : {
                }}
                options={{
                    headerStyle: {
                        backgroundColor: '#673ab7',
                        color: '#FFF',
                        padding: "10px"
                    },
                    rowStyle: {
                        backgroundColor: '#EEE',
                    },
                    searchFieldStyle: {
                        fontSize: "1.3rem",
                        width: "100%",
                    },
                }}
            />
        </div>
        
    )
}

const mapStateToProps = state => ({
    getUser(id) {
        return userSelector(id)(state)
    }
});

const mapDispatchToProps = {
    createOrg,
    deleteOrg,
    loadOrgs,
    deleteUser,
    loadUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EnhancedTable));