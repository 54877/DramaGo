import * as c3 from 'c3';
import 'c3/c3.css';
import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import Select from 'react-select';
import axios from 'axios';


const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

//取API值， 依照需要加入各data

// tag : tag
// lable : [數量]
// 標籤為選隱藏chart 主元件建立個元件data並判斷是否有值 有 = display-block 否 = display-none
// 會員管理頁面 有X軸

const MyChart = ({ legendPosi, plugin, day, isWidth, isFinish }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const [data, setData] = useState([{}]);


    const num = (c) => {

        return Math.ceil((Math.random() * (Object.values(isFinish)[c])))

    }

    useEffect(() => {

        if (Object.keys(isFinish).length == 1) {
            let a = []
            for (let i = 0; day.length > i; i++) {
                a.push(num(0))
            }

            setData([{
                label: Object.keys(isFinish)[0],
                data: a,
                barThickness: isWidth ? 4 : 12,
                borderSkipped: `boolean`,
                borderRadius: 100,
            }])

        } else if (Object.keys(isFinish).length == 2) {
            let a = []
            let b = []

            for (let i = 0; day.length > i; i++) {
                a.push(num(0))
            }
            for (let i = 0; day.length > i; i++) {
                b.push(num(1))
            }

            setData([
                {
                    label: Object.keys(isFinish)[0],
                    data: a,
                    barThickness: isWidth ? 4 : 12,
                    borderSkipped: `boolean`,
                    borderRadius: 100,
                },
                {},
                {
                    label: Object.keys(isFinish)[1],
                    data: b,
                    barThickness: isWidth ? 4 : 12,
                    borderSkipped: `boolean`,
                    borderRadius: 100,
                }
            ])
        } else {
            setData([{}])
        }

    }, [isFinish, day])


    // 創建或更新圖表
    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        // 創建新的圖表
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: day,
                datasets: data,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: isWidth ? 12 : 14,
                            },
                            stepSize: 3,
                        },
                    },
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'M/d',
                            },
                        },
                        ticks: {
                            font: {
                                size: isWidth ? 12 : 14,
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                layout: {
                    padding: {
                        top: isWidth ? 40 : 100,
                        right: isWidth ? 16 : 160,
                        left: isWidth ? 16 : 48,
                        bottom: isWidth ? 40 : 40,
                    },
                },
            },
            plugins: [legendPosi, plugin],
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [day, isWidth, data])

    return (
        <canvas ref={canvasRef}></canvas>
    );
};

//線條
// const MyChartLine = ({ legendPosi, plugin, day, isWidth }) => {
//     const canvasRef = useRef(null);
//     const chartRef = useRef(null);
//     const data = [
//         {
//             label: "1",  // 標籤
//             data: [10, 20, 30],  //標籤數據(Y軸資料)
//             backgroundColor: 'rgba(75, 192, 192, 0.5)',
//             borderColor: '#66AEDA',
//         },
//         {
//             label: "2",
//             data: [15, 25, 10],
//             backgroundColor: '#F96307',
//             borderColor: '#9BD579',
//         },
//         {
//             label: "3",
//             data: [15, 25, 10],
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//             borderColor: 'rgba(255, 99, 132, 1)',
//         }
//     ];

//     //chart
//     // 創建或更新圖表
//     useEffect(() => {
//         const ctx = canvasRef.current.getContext('2d');

//         // 創建新的圖表
//         chartRef.current = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: day,
//                 datasets: data,
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         ticks: {
//                             font: {
//                                 size: isWidth ? 12 : 14,
//                             },
//                             stepSize: 2,
//                         },
//                     },
//                     x: {
//                         type: 'time',
//                         time: {
//                             unit: 'day',
//                             displayFormats: {
//                                 day: 'M/d',
//                             },
//                         },
//                         ticks: {
//                             font: {
//                                 size: isWidth ? 12 : 14,
//                             },
//                         },
//                     },
//                 },
//                 plugins: {
//                     legend: {
//                         display: false,
//                     },
//                 },
//                 layout: {
//                     padding: {
//                         top: isWidth ? 40 : 100,
//                         right: isWidth ? 16 : 160,
//                         left: isWidth ? 16 : 48,
//                         bottom: isWidth ? 40 : 40,
//                     },
//                 },
//             },
//             plugins: [legendPosi, plugin],
//         });

//         return () => {
//             if (chartRef.current) {
//                 chartRef.current.destroy();
//             }
//         };
//     }, [day, isWidth])

//     return (
//         <canvas ref={canvasRef}></canvas>
//     );
// };

//派

const BarChartComponent = () => {
    useEffect(() => {
        c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['美劇', 20],
                    ['韓劇', 30],
                    ['日劇', 50],
                ],
                type: 'pie',
            },
            pie: {
                label: {
                    show: true,
                    format: function (value, ratio, id) {
                        return `${id} ${(ratio * 100).toFixed(1)}%`;
                    },
                },
            },
            legend: {
                show: false,
            },
        });
    }, []);

    return <div className='my-lg-19x my-4' id="chart"></div>

};

//標籤出團
const Option = ({ setSelectedOptions, selectedOptions }) => {
    const options = [
        { value: '全部', label: '全部' },
        { value: '出團', label: '出團' },
        { value: '未出團', label: '未出團' },
    ];

    const optionAll = [
        { value: '出團', label: '出團' },
        { value: '未出團', label: '未出團' },
    ]

    const [optionState, setOptionState] = useState(false)

    const handleChange = (selected) => {

        const hasAll = selected.some((e) => e.value === '全部');

        if (hasAll) {
            setSelectedOptions(optionAll)
            setOptionState(true)
        }
        else {
            setSelectedOptions(selected);
            setOptionState(false)
        }

    };

    return (
        <div style={{ whiteSpace: `nowrap` }} className=" w-100 fs-b1 fw-semibold">
            <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                placeholder="請選擇"
            />
        </div>
    );
};

//標籤tag
const OptionTag = ({ optiontag, setOptionTag }) => {
    const options = [

        { value: '全部', label: '全部' },
        { value: '看電影', label: '看電影' },
        { value: '看表演', label: '看表演' },
        { value: '逛劇展', label: '逛劇展' },
        { value: '買劇品', label: '買劇品' },
        { value: '上劇課', label: '上劇課' },
        { value: '劇本殺', label: '劇本殺' },
        { value: '接劇龍', label: '接劇龍' },
        { value: '聽劇透', label: '聽劇透' },
        { value: '遊劇旅', label: '遊劇旅' },
        { value: '追影星', label: '追影星' },

    ];

    const optionAll = [
        { value: '看電影', label: '看電影' },
        { value: '看表演', label: '看表演' },
        { value: '逛劇展', label: '逛劇展' },
        { value: '買劇品', label: '買劇品' },
        { value: '上劇課', label: '上劇課' },
        { value: '劇本殺', label: '劇本殺' },
        { value: '接劇龍', label: '接劇龍' },
        { value: '聽劇透', label: '聽劇透' },
        { value: '遊劇旅', label: '遊劇旅' },
        { value: '追影星', label: '追影星' },
    ]

    const [optionState, setOptionState] = useState(false)

    const handleChange = (selected) => {
        const hasAll = selected.some((e) => e.value === '全部');

        if (hasAll) {
            setOptionTag(optionAll)
            setOptionState(true)
        }
        else {
            setOptionTag(selected);
            setOptionState(false)
        }

    };
    return (
        <div style={{ whiteSpace: `nowrap` }} className=" w-100 fs-b1 fw-semibold">
            <Select
                isMulti
                options={options}
                value={optiontag}
                onChange={handleChange}
                placeholder="請選擇"
            />
        </div>
    );
}

const ChartOutlet = () => {
    const [day, setDay] = useState([])
    const [inday, setInDay] = useState(null)
    const [outday, setOutDay] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [optiontag, setOptionTag] = useState([])
    const [isWidth, setIsWidth] = useState(window.innerWidth <= 992);
    const [isFinish, setIsFinsh] = useState({})
    const [category, setCategory] = useState([])
    const [product, setProduct] = useState([])
    const [dayState, setDayState] = useState(false) //day狀態
    const [isFinishState, setIsFinshState] = useState(false)  // isFinsh 狀態
    useEffect(() => {
        const handleResize = () => {
            setIsWidth(window.innerWidth <= 992);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const inputDay = (e) => {
        const timestamp = new Date(e.target.value).getTime()
        setInDay(timestamp)
    }
    const outputDay = (e) => {
        const timestamp = new Date(e.target.value).getTime()
        setOutDay(timestamp)
    }
    //自定義
    const legendPosi = {
        id: 'legendPosi',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const legendItems = chart.legend.legendItems;
            const startX = isWidth ? 119 : 834;
            const startY = isWidth ? 16 : 40;
            let itemX;
            let itemY;
            const lineHeight = isWidth ? 50 : 20;
            let validIndex = 0;
            ctx.save();
            ctx.font = isWidth ? `14px` : '16px';
            ctx.textAlign = 'left';
            legendItems.forEach((item) => {
                if (!item.text || item.text.trim() === '') {
                    return;
                }
                if (isWidth) {
                    itemX = startX + validIndex * lineHeight;;
                    itemY = startY;
                } else {
                    itemX = startX;
                    itemY = startY + validIndex * lineHeight;
                }

                ctx.beginPath();
                ctx.roundRect(itemX, itemY, 10, 10, 10);
                ctx.fillStyle = item.fillStyle;
                ctx.fill();

                ctx.fillStyle = item.fontColor || '#000';
                ctx.fillText(item.text, itemX + 18, itemY + 10);
                validIndex++;
            });
            ctx.restore();
        }
    };

    //自定義
    const plugin = {
        id: 'customYAxisTitle',
        afterDraw(chart) {
            const { ctx, scales } = chart;
            const yAxis = scales.y;
            const title = '圖數';
            const x = isWidth ? 3 : 5
            const y = isWidth ? 16 : 36
            ctx.save();
            ctx.font = isWidth ? `14px` : '16px';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.fillText(title, yAxis.left - x, yAxis.top - y);
            ctx.restore();
        }
    };

    //日期
    useEffect(() => {

        const chang = (timestamp) => {
            return new Date(timestamp).toISOString().split('T')[0];
        }

        const b = 24 * 60 * 60 * 1000;
        if (!inday || !outday) return;
        const a = [];


        for (let timestamp = inday; timestamp <= outday; timestamp += b) {
            a.push(chang(timestamp));
        }

        for (let timestamp = outday; timestamp <= inday; timestamp += b) {
            a.push(chang(timestamp));
        }


        if (a.length > 9 && !isWidth) {
            setDay([]);
            alert(`日期不可超過10天`);
        } else if (a.length > 6 && isWidth) {
            setDay([]);
            alert(`日期不可超過6天`);
        } else {
            setDay(a)
        }

        if (day != [] && a.length < 10) setDayState(true)
        else setDayState(false)

    }, [inday, outday])

    //取得產品資訊
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/${apiPath}/products/all`)
                setProduct(res.data.products)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    // 待出團/出團data
    useEffect(() => {
        let a = 0, b = 0;
        setIsFinsh({});
        product.forEach((e) => {
            if (e.isFinish == 0) a++;
            else b++;
        });
        selectedOptions.map(e => {
            if (e.value == `出團` && selectedOptions.length == 1) {
                setIsFinsh(
                    {
                        出團: a
                    });
            } else if (e.value == `未出團` && selectedOptions.length == 1) {
                setIsFinsh(
                    {
                        未出團: b,
                    });
            } else {
                setIsFinsh(
                    {
                        出團: a,
                        未出團: b
                    });
            }
        })
        if (selectedOptions.length) setIsFinshState(true)
        else setIsFinshState(false)
    }, [selectedOptions]);

    return (<>
        {isWidth &&
            <div className='d-flex justify-content-end'>
                <button className="btn btn-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#Lable" aria-controls="staticBackdrop">
                    <i className="bi bi-funnel"></i>
                </button>
            </div>
        }
        {!isWidth &&
            <>
                <form className="row align-items-center mb-lg-6 mb-5">
                    <div className="col-4 " action="">
                        <div className="input-group align-items-center">
                            <span className="me-4 fs-b1 fw-semibold">日期</span>
                            <input
                                onChange={inputDay}
                                type="date"
                                className=" form-control rounded-end rounded-pill"
                                placeholder="開始時間" />
                            <span className="input-group-text">~</span>
                            <input
                                onChange={outputDay}
                                type="date"
                                className=" form-control rounded-start rounded-pill"
                                placeholder="結束時間" />
                        </div>
                    </div>

                    <div className="col-4 d-flex flex-nowrap align-items-center">
                        <span style={{ whiteSpace: `nowrap` }} className="me-4  fs-b1 fw-semibold">標籤</span>
                        <OptionTag optiontag={optiontag} setOptionTag={setOptionTag} />
                    </div>

                    <div className="col-4 d-flex flex-nowrap align-items-center">
                        <span style={{ whiteSpace: `nowrap` }} className="me-4  fs-b1 fw-semibold">出團情況</span>
                        <Option setSelectedOptions={setSelectedOptions} selectedOptions={selectedOptions} />
                    </div>
                </form >
            </>}

        <div style={{ height: '80vh' }} className="offcanvas offcanvas-bottom rounded-6 rounded-bottom " data-bs-backdrop="static" tabIndex="-1" id="Lable" aria-labelledby="Label">
            <form className='px-3 py-8 offcanvas-body'>
                <div className='mb-4'>
                    <div className='d-flex justify-content-between'>
                        <span className="me-4 fs-b1 mb-1 fw-semibold">日期</span>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="input-group">
                        <input
                            onChange={inputDay}
                            type="date"
                            className=" form-control rounded-end rounded-pill"
                            placeholder="開始時間" />
                        <span className="input-group-text">~</span>
                        <input
                            onChange={outputDay}
                            type="date"
                            className=" form-control rounded-start rounded-pill"
                            placeholder="結束時間" />
                    </div>
                </div>

                <div className='mb-4'>
                    <span style={{ whiteSpace: `nowrap` }} className="me-4 mb-1  fs-b1 fw-semibold">標籤</span>
                    <OptionTag optiontag={optiontag} setOptionTag={setOptionTag} />
                </div>

                <div className='mb-6'>
                    <span style={{ whiteSpace: `nowrap` }} className="me-4  mb-1 fs-b1 fw-semibold">出團情況</span>
                    <Option setSelectedOptions={setSelectedOptions} selectedOptions={selectedOptions} />
                </div>
                <button className='btn btn-brand-400 rounded-4 w-100 text-white' type="button" data-bs-dismiss="offcanvas" aria-label="Close">
                    套用
                </button>
            </form >
        </div>


        {dayState && isFinishState &&
            <>
                <div style={{ width: '100%', height: isWidth ? '300px' : '480px' }} className='shadow border rounded-4 mb-lg-6 mb-5'>
                    <MyChart legendPosi={legendPosi} plugin={plugin} day={day} isWidth={isWidth} isFinish={isFinish} />
                </div>
            </>
        }
        {/* <div style={{ width: '100%', height: isWidth ? '300px' : '480px' }} className='shadow border rounded-4 mb-lg-6 mb-5'>
            <MyChartLine legendPosi={legendPosi} plugin={plugin} day={day} isWidth={isWidth} />
        </div> */}
        <div className='shadow border rounded-4'>
            <BarChartComponent />
        </div>
    </>)
};

export default ChartOutlet;