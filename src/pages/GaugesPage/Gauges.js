import React, {useEffect} from 'react';
import { CustomTable } from "../../component/table";
import { connect } from 'react-redux';
import { loadGauges, gaugeListSelector } from '../../actions/gauges';
import { loadAccesses, accessListSelector } from '../../actions/accesses';
import { isLoading } from '../../actions/loading';
import { useTranslate } from "react-translate";
import moment from 'moment';

function Gauges({
    gaugeList,
    loadAccesses,
    accessList,
    loadGauges,
    loading,
    lang
}) {
    let t = useTranslate("Gauges");
    useEffect(() => {
        loadAccesses();
        loadGauges();
    }, []);
    var data=[];
    var gauges = localStorage.getItem('org_id') === "-1" ? gaugeList : gaugeList.filter(gauge => gauge.org_id === localStorage.getItem('org_id'));
    var sortedgauges = gauges.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    for(var i=0; i<sortedgauges.length; i++) {
        data[i]={
            id: sortedgauges[i].id,
            serial: sortedgauges[i].serial,
            current_count: sortedgauges[i].current_count,
            used_in: accessList.find(access=>access.id === sortedgauges[i].used_in) ? accessList.find(access=>access.id === sortedgauges[i].used_in).name : '',
            last_read: moment(sortedgauges[i].last_read).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"),
            state: sortedgauges[i].state
        }
    }
    const columns = [
        { title: t(`serial-${lang}`), field: 'serial', cellStyle: {textDecoration: "underline"} },
        { title: t(`counter-${lang}`), field: 'current_count', disableClick: true, editable: 'never'  },
        { title: t(`used_in-${lang}`), field: 'used_in', cellStyle: {textDecoration: "underline"}, editable: 'never' },
        { title: t(`last_read-${lang}`), field: 'last_read', disableClick: true, editable: 'never' },
        { title: t(`state-${lang}`), field: 'state', lookup: {0: 'Active', 1: 'In stock', 2: 'Removed'}, editable: 'never', disableClick: true },
    ];
    return loading ? (<div>loading...</div>) : (
        <CustomTable 
            columns={columns}
            data={data}
            isGauge={true}
            memberAccess={false}
            lang={lang}
        />
    )
}

const mapStateToProps = state => ({
    gaugeList: gaugeListSelector(state),
    accessList: accessListSelector(state),
    loading: isLoading(loadGauges)(state)
});

const mapDispatchToProps = {
    loadGauges,
    loadAccesses
};

export default connect(mapStateToProps, mapDispatchToProps)(Gauges);