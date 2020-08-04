import React, {useEffect} from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { loadReadings, updateReading, readingListSelector } from '../../actions/readings';
import { loadGauge, updateGauge, gaugeSelector } from '../../actions/gauges';

import MaterialTable from 'material-table';
import moment from 'moment';

function ReadingTable({
    loadReadings,
    updateReading,
    getGauge,
    loadGauge,
    updateGauge,
    columns,
    data,
    gauge,
    current_gauge
}) {
    return (
        <MaterialTable
            title=""
            columns={columns}
            data={data}
            editable={{
                isEditable: rowData => {
                    return data[0].id === rowData.id
                },
                onRowUpdate: async (newData, oldData) => {
                    if(parseInt(newData.new_value) <= parseInt(newData.old_value)) {
                        alert(`The new value must be bigger than old value ${newData.old_value}.`)
                    } else {
                        await updateReading({
                            ...oldData,
                            ...newData,
                            gauge: gauge,
                            updated_at: moment().format("YYYY-MM-DD")
                        });
                        await updateGauge({
                            ...current_gauge,
                            current_count: newData.new_value
                        });
                        await loadGauge(gauge);
                        await loadReadings();
                    }
                }
            }}
            options={{
                headerStyle: {
                    backgroundColor: '#673ab7',
                    color: '#FFF',
                    padding: "10px",
                },
                rowStyle: {
                    backgroundColor: '#EEE',
                    disabled: 'true'
                },
                searchFieldStyle: {
                    display: 'none'
                }
            }}
        />
    )
}

const mapStateToProps = state => ({
    getGauge(id) {
        return gaugeSelector(id)(state)
    },
    readingList: readingListSelector(state)
});

const mapDispatchToProps = {
    loadReadings, 
    updateReading,
    loadGauge,
    updateGauge
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReadingTable));