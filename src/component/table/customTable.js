import React, {useState, useEffect} from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { createGauge, loadGauges, deleteGauge, gaugeListSelector } from '../../actions/gauges';
import { createAccess, loadAccesses, deleteAccess, accessListSelector } from '../../actions/accesses';
import { loadUsers, userListSelector } from '../../actions/users';

import MaterialTable from 'material-table';
import moment from 'moment';
import { useTranslate } from "react-translate";

function CustomTable({
    createGauge, 
    loadGauges, 
    gaugeList,
    deleteGauge,
    createAccess,
    loadAccesses,
    accessList,
    deleteAccess,
    columns,
    data,
    memberAccess,
    isGauge,
    userList,
    loadUsers,
    history,
    lang
}) {
    let t = useTranslate("Member");
    let t1 = useTranslate("Gauges");
    useEffect(()=>{
        loadUsers();
    }, [])
    const handleCellClick = (event, row) => {
        if(!isGauge) {
            const id = accessList.find(access => access.name === event.target.innerHTML) ? accessList.find(access => access.name === event.target.innerHTML).id : '';
            const userId = userList.find(user=>user.name === event.target.innerHTML) ? userList.find(user => user.name === event.target.innerHTML).id : '';
            const guageId = gaugeList.find(gauge=>gauge.serial === event.target.innerHTML) ? gaugeList.find(gauge=>gauge.serial === event.target.innerHTML).id : '';

            if(id) {
                history.push(`editwateraccess/${id}`)
            } else if(userId) {
                history.push(`editMember/${userId}`)
            } else if(guageId) {
                history.push(`editGauges/${guageId}`)
            } else {
                return
            }
        } else {
            const id = gaugeList.find(gauge => gauge.serial === event.target.innerHTML) ? gaugeList.find(gauge => gauge.serial === event.target.innerHTML).id : '';
            const accessId = accessList.find(access => access.name === event.target.innerHTML) ? accessList.find(access => access.name === event.target.innerHTML).id : '';
            if(id) {
                history.push(`editGauges/${id}`)
            } else if(accessId){
                history.push(`editwateraccess/${accessId}`)
            } else {
                return
            }
        }
        
    }
    return (
        <MaterialTable
            key={columns.id}
            title={isGauge ? t1(`gauge_title-${lang}`) : t(`access_point_title-${lang}`)}
            columns={columns}
            data={data}
            onRowClick={handleCellClick}
            editable={!memberAccess ? {
                isDeletable: rowData => {
                    return rowData.state !== 0
                },
                onRowAdd: async newData => {
                    if(isGauge) {
                        if(gaugeList.find(gauge=>gauge.state !== 2 && gauge.serial === newData.serial)) {
                            alert("Serial number is already existed!");
                        } else {
                            await createGauge({ created_at: moment().format("YYYY-MM-DD"), last_read: moment().format("YYYY-MM-DD"), state: 1, org_id: localStorage.getItem('org_id'),...newData, initial_count: 0});
                            await loadGauges();
                        }
                    } else {
                        if(accessList.find(access=>access.name === newData.name)) {
                            alert("Access point ID is already existed!");
                        } else {
                            await createAccess({ created_at: moment().format("YYYY-MM-DD"), org_id: localStorage.getItem('org_id'), ...newData, last_usage: 0});
                            await loadAccesses();
                        }
                    }
                },
                onRowDelete: async oldData => {
                    if(isGauge) {
                        await deleteGauge(oldData.id);
                        await loadGauges();
                    } else {
                        await deleteAccess(oldData.id);
                        await loadAccesses();
                    }
                }
            } : {}}
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
    )
}

const mapStateToProps = state => ({
    gaugeList: gaugeListSelector(state),
    accessList: accessListSelector(state),
    userList: userListSelector(state)
});

const mapDispatchToProps = {
    createGauge, 
    loadGauges, 
    deleteGauge,
    createAccess,
    loadAccesses,
    deleteAccess,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CustomTable));