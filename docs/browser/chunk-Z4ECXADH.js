import{e as C,i as b,k as S,o as k}from"./chunk-QUD6TSQW.js";import{$a as f,Aa as s,Fa as p,Ka as h,Qa as v,T as r,Ua as t,V as m,Va as a,Wa as c,bb as o,cb as x,ea as u,fa as d,fb as g}from"./chunk-EL7H5PZR.js";function w(n,i){if(n&1&&(t(0,"div",2)(1,"div",4)(2,"div",5),u(),t(3,"svg",6),c(4,"path",7),a()(),d(),t(5,"div",8)(6,"h3",9),o(7),a()()()()),n&2){let e=f();s(7),x(e.error())}}function A(n,i){n&1&&(t(0,"div",3),c(1,"div",10),t(2,"h2",11),o(3," Completing authentication... "),a(),t(4,"p",12),o(5," Please wait while we finish setting up your account "),a()())}var y=class n{route=r(b);router=r(S);authService=r(k);error=p(null);ngOnInit(){let i=this.route.snapshot.queryParamMap.get("request_token"),e=this.route.snapshot.queryParamMap.get("approved");if(!i||e!=="true"){this.error.set("Authentication was cancelled or invalid"),setTimeout(()=>this.router.navigate(["/login"]),3e3);return}this.authService.createSession(i).subscribe({next:()=>{this.router.navigate(["/movies"])},error:l=>{this.error.set("Failed to create session. Please try again."),console.error("Session creation error:",l),setTimeout(()=>this.router.navigate(["/login"]),3e3)}})}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=m({type:n,selectors:[["app-auth-callback"]],standalone:!0,features:[g],decls:4,vars:1,consts:[[1,"min-h-screen","flex","items-center","justify-center","bg-gray-50"],[1,"max-w-md","w-full","space-y-8","p-4"],[1,"rounded-md","bg-red-50","p-4"],[1,"text-center"],[1,"flex"],[1,"flex-shrink-0"],["viewBox","0 0 20 20","fill","currentColor",1,"h-5","w-5","text-red-400"],["fill-rule","evenodd","d","M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z","clip-rule","evenodd"],[1,"ml-3"],[1,"text-sm","font-medium","text-red-800"],[1,"animate-spin","rounded-full","h-12","w-12","border-b-2","border-indigo-500","mx-auto"],[1,"mt-6","text-center","text-3xl","font-bold","tracking-tight","text-gray-900"],[1,"mt-2","text-center","text-sm","text-gray-600"]],template:function(e,l){e&1&&(t(0,"div",0)(1,"div",1),h(2,w,8,1,"div",2)(3,A,6,0,"div",3),a()()),e&2&&(s(2),v(l.error()?2:3))},dependencies:[C],encapsulation:2})};export{y as AuthCallbackComponent};