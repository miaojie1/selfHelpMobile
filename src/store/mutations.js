// 提交 mutations是更改Vuex状态的唯一合法方法
export const modifyTitle = (state, val) => {
  state.title = val
}
export const modifyTypeDjbh = (state, val) => {
  state.typeDjbh = val
}
export const modifyDjbh = (state, val) => {
  state.djbh = val
}
export const modifyDjbhItem = (state, val) => {
  state.djbhItem = val
}
export const modifyMissionTaskType = (state, val) => {
  state.missionTaskType = val
}
export const modifyMissionTitle = (state, val) => {
  state.missionTitle = val
}
export const modifyMissionFlowId = (state, val) => {
  state.missionFlowId = val
}
export const modifyMissionRows = (state, val) => {
  state.missionRows = val
}
export const modifyMissionEmpNum = (state, val) => {
  state.missionEmpNum = val
}
export const modifyMissionFlowDetail = (state, val) => {
  state.missionFlowDetail = val
}
export const modifyPathStatus = (state, val) => {
  state.pathStatus = val
}
export const modifyFlowData = (state, val) => {
  state.content = val
}
export const modifyDepart = (state, val) => {
  state.depart = val
}
export const modifyCompany = (state, val) => {
  state.company = val
}
export const modifyChartTitle = (state, val) => {
  state.chartTitle = val
}
export const back = (state, val) => {
  if (val === 'isAn') {
    alert(val)
    window.webkit.messageHandlers.Call.postMessage({})
  } else if (val === 'isIos') {
    alert(val)
    window.webkit.messageHandlers.Call.postMessage({})
  }
}
