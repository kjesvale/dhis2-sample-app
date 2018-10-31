import React, { Component } from 'react';
import logo from '../logo.png';
import Api from '../api';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            commodities: [],
        };
    }

    getDataFromDhis2 = () => {
        Api.getDataElementsThatStartsWith('Commodities')
            .then(data => {
                this.setCommodities(data.dataElements);
            })
            .catch(error => {
                console.error('Error during data retrieval:', error);
            });
    };

    postDataToDhis2 = () => {
        const dataElement = {
            name: 'Commodities - Tran',
            shortName: 'Commodities - Tran',
            valueType: 'NUMBER',
            aggregationType: 'SUM',
            domainType: 'AGGREGATE',
            description: 'Current supply of tran',
        };

        Api.postDataElement(dataElement).then(() => {
            this.getDataFromDhis2();
        });
    };

    deleteDataFromDhis2 = () => {
        const tranCommodity = this.state.commodities.find(
            dataElement => dataElement.displayName === 'Commodities - Tran'
        );

        if (tranCommodity) {
            Api.deleteDataElement(tranCommodity.id)
                .then(() => {
                    this.getDataFromDhis2();
                })
                .catch(error => {
                    console.error('Error during data retrieval:', error);
                });
        }
    };

    setCommodities = commodities => {
        this.setState({
            commodities,
        });
    };

    render() {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <span>Sample application</span>
                </header>
                <main>
                    <div className="content">
                        <div className="buttons">
                            <button onClick={this.getDataFromDhis2}>
                                Get data
                            </button>
                            <button onClick={this.postDataToDhis2}>
                                Post "tran"
                            </button>
                            <button onClick={this.deleteDataFromDhis2}>
                                Delete "tran"
                            </button>
                        </div>

                        {/* Render commodities, one by one */}
                        {this.state.commodities.map(item => (
                            <p key={item.id}>
                                <code>{item.displayName}</code>
                            </p>
                        ))}
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
