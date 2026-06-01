'use strict';
const {OpenShiftClientX} = require('pipeline-cli')

module.exports = (settings)=>{
  const phases = settings.phases
  const options = settings.options
  const oc=new OpenShiftClientX(Object.assign({'namespace':phases.build.namespace}, options));
  const target_phase=options.env

  for (var k in phases){
    if (phases.hasOwnProperty(k)) {
      const phase=phases[k]
      if (k == target_phase ){
        //console.log(`phase=${phase}`)
        //oc.raw('get', ['bc'], {selector:`app-name=${phase.name},env-id=${phase.changeId},env-name!=prod,!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`, namespace:phase.namespace, 'output':'custom-columns=kind:.spec.output.to.kind,name:.spec.output.to.name', 'no-headers':'true'})
        let buildConfigs=oc.get('bc', {selector:`app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`, namespace:phase.namespace})
        buildConfigs.forEach((bc)=>{
          if (bc.spec.output.to.kind == 'ImageStreamTag'){
            oc.delete([`ImageStreamTag/${bc.spec.output.to.name}`],{'ignore-not-found':'true', 'wait':'true', namespace:phase.namespace})
          }
        })
        
        let deployments=oc.get('deployment', {selector:`app=${phase.instance},env-id=${phase.changeId},env-name=${k},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`, namespace:phase.namespace})
        deployments.forEach((deployment)=>{
          let containers=deployment.spec.template.spec.containers
          containers.forEach((trigger)=>{
            if (containers.image.includes(':')){
              oc.delete([`ImageStreamTag/${trigger.imageChangeParams.from.name}`],{'ignore-not-found':'true', 'wait':'true', namespace:phase.namespace})
            }
          })
        })
        
        oc.raw('delete', ['all'], {selector:`app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`, wait:'true', namespace:phase.namespace})
        oc.raw('delete', ['pvc,Secret,configmap,endpoints,RoleBinding,role,ServiceAccount,Endpoints'], {selector:`app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`, wait:'true', namespace:phase.namespace})
      }
    }
  }
}