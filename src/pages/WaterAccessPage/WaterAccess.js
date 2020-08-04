import React, {useEffect} from 'react';
import { CustomTable } from "../../component/table";
import { connect } from 'react-redux';
import { loadAccesses, accessListSelector } from '../../actions/accesses';
import { loadUsers, userListSelector } from '../../actions/users';
import { loadGauges, gaugeListSelector } from '../../actions/gauges';
import { isLoading } from '../../actions/loading';
import { useTranslate } from "react-translate";

function WaterAccess({
    loadAccesses,
    accessList,
    loadGauges,
    gaugeList,
    loadUsers,
    userList,
    loading,
    lang
}) {
    let t = useTranslate("waterAccess");
    useEffect(() => {
        loadAccesses();
        loadGauges();
        loadUsers();
    }, []);
    var users = localStorage.getItem('org_id') === "-1" ? userList : userList.filter(user => user.org_id === localStorage.getItem('org_id'));
    var gauges = localStorage.getItem('org_id') === "-1" ? gaugeList : gaugeList.filter(gauge => gauge.org_id === localStorage.getItem('org_id'));
    var accesses = localStorage.getItem('org_id') === "-1" ? accessList : accessList.filter(access => access.org_id === localStorage.getItem('org_id'));
    var data=[];
    var userLookup = {};
    var gaugeLookup = {};
    for(var i=0; i<users.length; i++) {
        userLookup[users[i].id]=users[i].name;
    }
    for(var i=0; i<gauges.length; i++) {
        gaugeLookup[gauges[i].id]=gauges[i].serial;
    }
    var sortedaccesses = accesses.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    for(var i=0; i<sortedaccesses.length; i++) {
        data[i]={
            id: sortedaccesses[i].id,
            name: sortedaccesses[i].name,
            member: sortedaccesses[i].member,
            gauge: sortedaccesses[i].gauge,
            last_usage: sortedaccesses[i].last_usage
        }
    }
    const columns = [
        { title: t(`id-${lang}`), field: 'name', cellStyle: {textDecoration: "underline"} },
        { title: t(`member-${lang}`), field: 'member', lookup: userLookup, cellStyle: {textDecoration: "underline"} },
        { title: t(`gauge-${lang}`), field: 'gauge',lookup: gaugeLookup, editable: 'never', cellStyle: {textDecoration: "underline"} },
        { title: t(`last_usage-${lang}`), field: 'last_usage', disableClick: true, editable: 'never' },
    ];

    return loading ? (<div>loading...</div>) : (
        <CustomTable 
            columns={columns}
            data={data} 
            isGauge={false}
            memberAccess={false}
            lang={lang}
        />
    )
}
const mapStateToProps = state => ({
    accessList: accessListSelector(state),
    userList: userListSelector(state),
    gaugeList: gaugeListSelector(state),
    loading: isLoading(loadAccesses)(state),
});

const mapDispatchToProps = {
    loadAccesses,
    loadGauges,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(WaterAccess);