<template>
  <div id="my_input">
    <div class="input-wrap">
        <i v-if="required">*</i>
        <label>{{title}}</label>
        <input 
            :type="type" 
            :value="val" 
            @input="$emit('input',$event.target.value)" 
            @blur="$emit('blur')">
    </div>
    <p class="error" v-show="error">{{error}}</p>
  </div>
</template>
<script>
export default {
    props: {
        title: String,
        type: {
            type: String,
            default: 'text'
        },
        error: String,
        required: Boolean,
        val: [String,Number]
    }
}
</script>
<style lang="less" scoped>
@bgc: #FBFBFB;
@bdColor: #eee;
#my_input {
    position: relative;
    margin-bottom: 20px;
    .input-wrap {
        i {
            display: inline-block;
            width: 14px;
            height: 14px;
            line-height: 14px;
            color: red;
            position: absolute;
            left: 6px;
            top: 8px;
        }
        label {
            padding: 8px 15px;
            height: 38px;
            line-height: 20px;
            border: 1px solid @bdColor;
            border-radius: 2px 0 0 2px;
            text-align: center;
            background-color: @bgc;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box;
        }
        input {
            min-width: 160px;
            height: 36px;
            border: 1px solid @bdColor;
            padding: 0 5px;
            border-left: none;
            border-radius: 0 2px 2px 0;
            font-size: 14px;
            &:focus {
                outline: none;
            }
        }
    }
    .error {
        position: absolute;
        top: 38px;
        line-height: 20px;
        font-size: 12px;
        color: red;
    }
}
</style>
