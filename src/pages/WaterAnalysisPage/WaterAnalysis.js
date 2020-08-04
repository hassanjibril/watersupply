import React, {useEffect} from 'react';
import { AnalysisTable } from "../../component/table";
import { connect } from 'react-redux';
import { loadAnalysises, analysisListSelector } from '../../actions/analysis';
import { isLoading } from '../../actions/loading';
import { useTranslate } from "react-translate";
import moment from 'moment';

function WaterAnalysis({
    loadAnalysises,
    analysisList,
    loading,
    lang
}) {
    let t = useTranslate("WaterAnalysis");
    useEffect(() => {
        loadAnalysises();
    }, []);
    var analysises = localStorage.getItem('org_id') === "-1" ? analysisList : analysisList.filter(analysis => analysis.org_id === localStorage.getItem('org_id'));
    var data=[];
    var sortedanalysises = analysises.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    for(var i=0; i<sortedanalysises.length; i++) {
        data[i]={
            id: sortedanalysises[i].id,
            created_at: moment(sortedanalysises[i].created_at).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"),
            description: sortedanalysises[i].description,
            lab_name: sortedanalysises[i].lab_name
        }
    }
    const columns = [
        { title: t(`date-${lang}`), field: 'created_at', editable: 'never'},
        { title: t(`description-${lang}`), field: 'description' },
        { title: t(`lab_name-${lang}`), field: 'lab_name' },
    ];

    return loading ? (<div>loading...</div>) : (
        <AnalysisTable 
            columns={columns}
            data={data} 
            lang={lang}
        />
    )
}
const mapStateToProps = state => ({
    analysisList: analysisListSelector(state),
    loading: isLoading(loadAnalysises)(state),
});

const mapDispatchToProps = {
    loadAnalysises,
};

export default connect(mapStateToProps, mapDispatchToProps)(WaterAnalysis);