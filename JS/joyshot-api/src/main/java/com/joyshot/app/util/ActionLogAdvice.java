package com.joyshot.app.util;

import org.aspectj.lang.JoinPoint;

/**
 * @author avery
 */
//@Aspect
//@Component
public class ActionLogAdvice {

    //    @Pointcut("@annotation(org.springframework.web.bind.annotation.GetMapping)")
//    @Pointcut("execution(* com.lhdecor.crm.controller.*.*(..))")
    private void test() {
        System.out.println("======= test ========");
    }

    //    @Before("test()")
    public void beforeAdv(JoinPoint joinPoint) {
//        System.out.println("get request ### beforeAdv ### triggered");


    }

    //    @After("test()")
    public void afterDev(JoinPoint joinPoint) {
//        System.out.println("get request ### afterDev ### triggered");
//
//        String className = joinPoint.getTarget().getClass().getName();
//
//
//        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
//        String methodName = signature.getName();
//        System.out.println(className + "-" + methodName);
//
//        Parameter[] parameters = signature.getMethod().getParameters();
//        for (Parameter parameter : parameters) {
//            System.out.println("parameters:" + parameter.getName());
//        }
//
//        Object[] args = joinPoint.getArgs();
//        for (Object arg : args) {
//            System.out.println("arg:" + arg);
//            if (arg instanceof HttpServletRequest) {
//                HttpServletRequest request = (HttpServletRequest)arg;
//                Enumeration<String> headerNames = request.getHeaderNames();
//                while (headerNames.hasMoreElements()) {
//                    String s = headerNames.nextElement();
//                    System.out.println("Header " + s + "=" + request.getHeader(s));
//                }
//            }
//        }
    }
}
