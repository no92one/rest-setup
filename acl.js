import { readFileSync } from "fs"

const accessList = JSON.parse(
  readFileSync(new URL("./access-list.json", import.meta.url))
)

export default function acl(request, response, next){
    let userRoles = request.session?.user ? [request.session.user.role] : ['anonymous'] 
    userRoles.push('*')

    let found = false

    for(const endpoint of accessList) {
        if(request.route.path === endpoint.route){
            for(const role of endpoint.roles){
                if(userRoles.some(type => role.types.includes(type)) 
                    && role.methods.includes(request.method)){
                    found = true
                }
            }
        }
    }
   
    if(found){
        next()
    }else{
        return response.status(403).json({message: "You don't have access"})
    }  
} 