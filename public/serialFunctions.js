function bufferToHT(pose_array){
    let HT_matrix = [];
    let pass_pos = false;
    pose_array.forEach((value, index) => {
        if(index === 0 && !pass_pos){
            value.forEach((value) => HT_matrix.push(value));
            pass_pos != pass_pos;
        }
    })
    for(let i = 0; i < 3; i++){
        HT_matrix[i][3] = pose_array[1][i];
    }
    HT_matrix.push([0, 0, 0, 1]);
    
    return HT_matrix;
}

function writeBuffer(data_buffer, SerialPort){
    data_buffer.forEach(value => value.forEach(value => SerialPort.write(value.toString())));
    SerialPort.write('\n');
};

module.exports = { bufferToHT, writeBuffer };