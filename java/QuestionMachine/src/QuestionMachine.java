
package calcuator;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Random;
import java.util.Vector;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JRadioButtonMenuItem;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.JTextPane;
import javax.swing.ScrollPaneConstants;
import javax.swing.SpringLayout;




public class QuestionMachine extends BasicWindow implements ItemListener,KeyListener{
	private static boolean firstRun = false;
	private static boolean toTake = false;
	private static int fi = 1;
	private static int si = 1;
	private static int sd = 1;
	private static int td = 1;
	private static int scale = 0;
	private static String op = "�[��";
	private static double cans;
	private static String uans;
	private static String dcans;
	private static MakeQuestion mq = new MakeQuestion();
	public static void main(String[] args) throws IOException {
		new QuestionMachine ();
	}



	QuestionMachine() throws IOException{
		execute();
		
	}
	JPanel paneA = new JPanel();
	JPanel paneB = new JPanel();
	JPanel pane1 = new JPanel();
	JPanel pane2 = new JPanel();
	JPanel pane3 = new JPanel();
	JPanel panec = new JPanel();
	JPanel paned = new JPanel();
	JTextPane text = new JTextPane();
	JTextField ansText = new JTextField();
	JScrollPane scroll1 = new JScrollPane(text);
	JScrollPane scroll2 = new JScrollPane(ansText);
	JCheckBox unite = new JCheckBox("�Τ@",true);
	JCheckBox sign = new JCheckBox("���t");
	JRadioButton decimal = new JRadioButton("�p��");
	JRadioButton integer = new JRadioButton("���");
	ButtonGroup group = new ButtonGroup();
	JComboBox round45 = new JComboBox(new Object[] {"�|�ˤ��J","0","1"
			,"2","3","4","5","6","7","8","9","10"});
	JComboBox before = new JComboBox(new Object[] {"�п�ܾ�Ʀ��","1","2","3","4","5"});
	JComboBox after = new JComboBox(new Object[] {"�п�ܤp�Ʀ��","1","2","3","4","5"});
	JComboBox column = new JComboBox(new Object[] {"�п�ܦ��","1","2","3","4","5"});
	JComboBox row = new JComboBox(new Object[] {"�п�ܭӼ�","1","2","3","4","5","6","7"});
	JComboBox operator = new JComboBox(new Object[] {"�п�ܹB���k","�[��","��","��"});
	JLabel hint = new JLabel("�@����");
	static JButton ansbn = new JButton("�}�l");
	void edit() {
		
		round45.addItemListener(this);
		round45.setPreferredSize(new Dimension(10,1));
		round45.setEnabled(false);
		
		
		decimal.addItemListener(this);
		integer.addItemListener(this);
		unite.addItemListener(this);
		sign.addItemListener(this);
		paned.add(Box.createGlue());
		paned.add(decimal);
		paned.add(integer);
		paned.add(Box.createGlue());
		paned.add(unite);
		paned.add(sign);
		paned.add(round45);
		paned.add(Box.createGlue());
		BoxLayout layoutd = new BoxLayout(paned,BoxLayout.X_AXIS);
		paned.setLayout(layoutd);
		
		
		
		row.addItemListener(this);
		column.addItemListener(this);
		operator.addItemListener(this);
		
		panec.add(row);
		panec.add(column);
		panec.add(operator);
		
		BoxLayout layout = new BoxLayout(panec,BoxLayout.X_AXIS);
		panec.setLayout(layout);
		
		Font sserif = new Font("SansSerif",1,18);
		
		text.setEditable(false);
		

		
		text.setPreferredSize(new Dimension(303, 100));
		ansText.setPreferredSize(new Dimension(303, 35));
		
		ansText.setBackground(Color.BLACK);
		ansText.setCaretColor(Color.white);
		ansText.setForeground(Color.white);
		ansText.setFont(sserif);

		text.setBackground(Color.BLACK);
		text.setCaretColor(Color.white);
		text.setForeground(Color.white);
		text.setFont(sserif);
		
		SpringLayout spring = new SpringLayout();
		SpringLayout spring1 = new SpringLayout();
		pane1.setLayout(spring);
		pane2.setLayout(spring1);
		pane1.setPreferredSize(new Dimension(303,403));
		scroll1.setPreferredSize(new Dimension(303,100));
		pane2.setPreferredSize(new Dimension(303,100));
//		pane3.setPreferredSize(new Dimension(255,300));
//		hint.setFont(sserif);
		hint.setFont(new Font("SansSerif",3,13));
		try {
			ap.initPane(this);
//			pane3.add(ap.getPane());
			pane1.add(ap.getPane());
			
		} catch (IOException e) {e.printStackTrace();} 
		
		
		text.addKeyListener(this);
		ansText.addKeyListener(this);
		pane1.add(scroll1);
		pane2.add(scroll2);
		pane2.add(ansbn);
		pane2.add(hint);
		
		ansbn.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				textEvent(ansText,text);
			}		
		});
		
		spring.putConstraint(SpringLayout.HORIZONTAL_CENTER, ap.getPane(), 0, SpringLayout.HORIZONTAL_CENTER, pane1);
		spring.putConstraint(SpringLayout.NORTH, ap.getPane(), 0, SpringLayout.NORTH, pane1);
		spring.putConstraint(SpringLayout.HORIZONTAL_CENTER, scroll1, 0, SpringLayout.HORIZONTAL_CENTER, pane1);
		spring.putConstraint(SpringLayout.NORTH, scroll1, 5, SpringLayout.SOUTH, ap.getPane());
		
		spring1.putConstraint(SpringLayout.HORIZONTAL_CENTER, hint, 0, SpringLayout.HORIZONTAL_CENTER, pane2);
		spring1.putConstraint(SpringLayout.NORTH, hint, 0, SpringLayout.NORTH, pane2);
		spring1.putConstraint(SpringLayout.HORIZONTAL_CENTER, scroll2, 0, SpringLayout.HORIZONTAL_CENTER, pane2);
		spring1.putConstraint(SpringLayout.NORTH, scroll2, 0, SpringLayout.SOUTH, hint);
		spring1.putConstraint(SpringLayout.NORTH, ansbn, 0, SpringLayout.SOUTH, scroll2);
		spring1.putConstraint(SpringLayout.EAST, ansbn, 0, SpringLayout.EAST, scroll2);
	
		
//		---B----
		
		before.addItemListener(this);
		after.addItemListener(this);
		
		integer.setSelected(true);
		group.add(integer);
		group.add(decimal);
		
//		setColor(1);
		super.setTitle("�X�D��");
		
	}

	private void setColor(int col) {
		Color darkGray = Color.DARK_GRAY;
		
		Color ivory = new Color(255,255,240);
		if(col == 1) {
			//panel
			paneA.setBackground(darkGray);
			paneB.setBackground(darkGray);
			pane1.setBackground(darkGray);
			pane2.setBackground(darkGray);
			panec.setBackground(darkGray);
			paned.setBackground(darkGray);
			//else1
			before.setBackground(darkGray);
			after.setBackground(darkGray);
			column.setBackground(darkGray);
			row.setBackground(darkGray);
			operator.setBackground(darkGray);
			round45.setBackground(darkGray);
			//else2
			decimal.setBackground(darkGray);
			integer.setBackground(darkGray);
			sign.setBackground(darkGray);
			unite.setBackground(darkGray);
			
			before.setForeground(ivory);
			after.setForeground(ivory);
			column.setForeground(ivory);
			row.setForeground(ivory);
			operator.setForeground(ivory);
			round45.setForeground(ivory);
			
			decimal.setForeground(ivory);
			integer.setForeground(ivory);
			sign.setForeground(ivory);
			unite.setForeground(ivory);
		}
		
	}
	@Override
	public void keyTyped(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}
	private static AnswerPane ap = new AnswerPane();
	private static String qs; 
	private static StringBuffer forAppend = new StringBuffer();
	private static long start = 0L;
	private static long end = 0L;
	private static void textEvent(JTextField ansText,JTextPane text) {
		if(firstRun) {
			firstRun = false;
			
			if(mq.getIAD()) {
				qs = mq.display(fi, si, op,scale);
				cans = mq.ANS;
				dcans = Integer.toString((int)cans);
			}	
			else {
				qs = mq.display(fi, sd,td, op,scale);
				cans = mq.ANS;
				dcans = Double.toString(cans);
			}
			
			ap.updatePane(qs);
			ansbn.setText("�e�X");
			
			toTake = true;
			start = System.currentTimeMillis()/100;
		}else {
			if(toTake) {
				end = System.currentTimeMillis()/100;
				toTake = false;
//				forAppend.append(qs);
				uans = ansText.getText();
//				try {
//					if(Double.parseDouble(uans)==cans)
//						forAppend.append("���ߵ���F\n");
//					else 
//						forAppend.append("���~�A���T���׬�:").append(dcans).append("\n");
//				}catch(NumberFormatException e) {
//					forAppend.append("�L�Ŀ�J�A���T���׬�:").append(dcans).append("\n");
//				}
				
				forAppend.append(mq.showANS(scale, uans));
				forAppend.append("�@��F").append(((double)end-(double)start)/10).append("��");
				text.setText(forAppend.toString());
				ansText.setText("");
				ansbn.setText("�U�@�D");
				forAppend = new StringBuffer();
			}else {
				
				if(mq.getIAD()) {
					qs = mq.display(fi, si, op,scale);
					cans = mq.ANS;
					dcans = Integer.toString((int)cans);
				}	
				else {
					qs = mq.display(fi, sd,td, op,scale);
					cans = mq.ANS;
					dcans = Double.toString(cans);
				}
				text.setText("");
				ansbn.setText("�e�X");
				ap.updatePane(qs);
				toTake = true;
				start = System.currentTimeMillis()/100;
			}
		}
		
	}	
//	private static void round45Event(JComboBox round45,JPanel paned,boolean r45) {
//		if(r45) {
//			paned.remove(6);
//			paned.add(round45);
//			paned.add(Box.createGlue());	
//		}
//		else 
//			paned.remove(round45);
//	}

	@Override
	public void keyPressed(KeyEvent e) {

		
		if(e.getKeyCode()==KeyEvent.VK_ENTER) {
			textEvent(ansText,text);
		}

	}
	@Override
	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}

	JPanel p1 = new JPanel(){{setPreferredSize(new Dimension(50,20));}};
	JPanel p2 = new JPanel(){{setPreferredSize(new Dimension(50,10));}};
	JPanel p3 = new JPanel(){{setPreferredSize(new Dimension(50,25));}};
	JPanel p4 = new JPanel(){{setPreferredSize(new Dimension(50,25));}};
	JPanel p5 = new JPanel(){{setPreferredSize(new Dimension(50,10));}};
	private static boolean r45 = false;
	private static boolean addr45 = false;
	@Override
	public void itemStateChanged(ItemEvent e) {
		String str;
//		JPanel p1 = new JPanel();
		BoxLayout l1 ;
		BoxLayout l2 ;
		  if(e.getSource().equals(integer)&&integer.isSelected()) {
//			  decimal.setSelected(false);
//			  integer.setSelected(true);
			  paneB.setVisible(false);
			  paneA.setVisible(true);
			  paneB.removeAll();
			  panec.removeAll();
			  panec.add(Box.createHorizontalGlue());
			  panec.add(row);
			  panec.add(Box.createHorizontalGlue());
			  panec.add(column);
			  panec.add(Box.createHorizontalGlue());
			  panec.add(operator);
			  panec.add(Box.createHorizontalGlue());
			  l1 = new BoxLayout(panec,BoxLayout.X_AXIS);
			  panec.setLayout(l1);
			  l2 = new BoxLayout(paneA,BoxLayout.Y_AXIS);
			 
			  paneA.add(p1);
			  paneA.add(panec);
			  paneA.add(p2);
			  paneA.add(paned);
			  paneA.add(p3);
//			  paneA.add(pane3);
			  paneA.add(pane1);
			  paneA.add(p4);
			  paneA.add(pane2);
			  paneA.add(p5);
			  
			  paneA.setLayout(l2);
			  super.add(paneA);
			  super.remove(paneB);
			  mq.setIAD(true);
			  firstRun = true;
			  
			  //round45
			  if(!((String)operator.getSelectedItem()).equals("��"))r45 = false;
		  }
		  if(e.getSource().equals(decimal)&&decimal.isSelected()) {
//			  integer.setSelected(false);
//			  decimal.setSelected(true);
			  paneA.setVisible(false);
			  paneB.setVisible(true);
			  paneA.removeAll();
			  panec.removeAll();
			  panec.add(Box.createHorizontalGlue());
			  panec.add(row);
			  panec.add(Box.createHorizontalGlue());
			  panec.add(before);
			  panec.add(Box.createHorizontalGlue());
			  panec.add(after);
			  panec.add(Box.createHorizontalGlue());
			  panec.add(operator);
			  panec.add(Box.createHorizontalGlue());
			  l1 = new BoxLayout(panec,BoxLayout.X_AXIS);
			  panec.setLayout(l1);
			  l2 = new BoxLayout(paneB,BoxLayout.Y_AXIS);

			  paneB.add(p1);
			  paneB.add(panec);
			  paneB.add(p2);
			  paneB.add(paned);
			  paneB.add(p3);
//			  paneB.add(pane3);
			  paneB.add(pane1);
			  paneB.add(p4);
			  paneB.add(pane2);
			  paneB.add(p5);
			  
			  paneB.setLayout(l2);
			  super.add(paneB);
			  super.remove(paneA);//NEW
			  mq.setIAD(false);
			  firstRun = true;
			  
			  //round45
			  r45 = true;
		  }
		  if(e.getSource().equals(sign)) {
			  if(sign.isSelected())mq.setNAG(true);
			  else mq.setNAG(false);
			  
		  }
		  if(e.getSource().equals(unite)) {
			  if(unite.isSelected())mq.setUNF(true);
			  else mq.setUNF(false);
		  }
		  if(e.getSource().equals(before)) {
			  str = (String)before.getSelectedItem();
			  switch(str) {
			  case"�п�ܾ�Ʀ��":break;
			  case"1":sd=1;break;
			  case"2":sd=2;break;
			  case"3":sd=3;break;
			  case"4":sd=4;break;
			  case"5":sd=5;break;
			  
			  }
		  }
		  if(e.getSource().equals(after)) {
			  str = (String)after.getSelectedItem();
			  switch(str) {
			  case"�п�ܤp�Ʀ��":break;
			  case"1":td=1;break;
			  case"2":td=2;break;
			  case"3":td=3;break;
			  case"4":td=4;break;
			  case"5":td=5;break;
			  
			  }
		  }
		  if(e.getSource().equals(row)) {
			  str = (String)row.getSelectedItem();
			  switch(str) {
			  case"�п�ܭӼ�":break;
			  case"1":fi=1;break;
			  case"2":fi=2;break;
			  case"3":fi=3;break;
			  case"4":fi=4;break;
			  case"5":fi=5;break;
			  case"6":fi=6;break;
			  case"7":fi=7;break;
			  
			  }
		  }
		  if(e.getSource().equals(column)) {
			  str = (String)column.getSelectedItem();
			  switch(str) {
			  case"�п�ܦ��":break;
			  case"1":si=1;break;
			  case"2":si=2;break;
			  case"3":si=3;break;
			  case"4":si=4;break;
			  case"5":si=5;break;
			  
			  }
		  }
		  if(e.getSource().equals(operator)) {
			  str = (String)operator.getSelectedItem();
			  row.setEnabled(true);//NEW
			  switch(str) {
			  case"�п�ܹB���k":break;
			  case"�[��":op="�[��";break;
			  case"��":op="��";break;
			  case"��":op="��";
			  row.setEnabled(false);
			  row.setSelectedIndex(2);
			  r45=true;
			  break;//NEW
			  
			  }
		  }
		  if(e.getSource().equals(round45)) {
			  str = (String)round45.getSelectedItem();
			  switch(str) {
			  case"�|�ˤ��J":scale=0;break;
			  case"0":scale=0;break;
			  case"1":scale=1;break;
			  case"2":scale=2;break;
			  case"3":scale=3;break;
			  case"4":scale=4;break;
			  case"5":scale=5;break;
			  case"6":scale=6;break;
			  case"7":scale=7;break;
			  case"8":scale=8;break;
			  case"9":scale=9;break;
			  case"10":scale=10;break;
			  
			  }
		  }
//		  System.out.println(operator.getSelectedItem());
//		  System.out.println(addr45);
//		  System.out.println(r45);
		  //decimal
//		  if(decimal.isSelected()&&((String)operator.getSelectedItem()).equals("��"))
//			  r45 = true;
		  if(integer.isSelected()&&!((String)operator.getSelectedItem()).equals("��"))
			  r45 = false;
		  
		  if(!r45&&addr45) {
			  addr45 = false;
			  round45.setEnabled(false);
			  round45.setSelectedIndex(1);
//			  paned.remove(round45);
//			  paneA.repaint();
//			  paneB.repaint();
			  
		  }else if(r45&&!addr45) {
			  
			  addr45 = true;
			  round45.setEnabled(true);
//			  paned.remove(6);
//			  paned.add(round45);
//			  paned.add(Box.createGlue());	
//			  paned.repaint();
//			  round45.setVisible(true);
			  
		  }
	}
	
}
class MakeQuestion {
//	private BigDecimal bd;
//	private LinkedList<String> number = new LinkedList<String>();
	private Random ran = new Random();
	private String op = "�[��";
//	private int f = 0;
//	private int s = 0;
//	private int t = 0;
	double ANS = 0.0;
	private boolean[] errors = {false,false,false,false,false};
	//{divideByZero,computeElse,,,}
	private boolean IAD = true;//Integer true
	private boolean  UNF = true;
	private boolean NAG = false;
	public void setIAD(boolean f) {
		this.IAD = f;
	}
	public void setUNF(boolean f) {
		this.UNF = f;
	}
	public void setNAG(boolean f) {
		this.NAG = f;
	}
	public boolean getIAD() {
		return this.IAD;
	}
	public boolean getUNF() {
		return this.UNF;
	}
	public String showANS(int addr45,String uans) {
		StringBuffer forAppend = new StringBuffer();
		String dcans = "error";
		int count = 0;
		if(IAD&&!op.equals("��")) {
			try {
				dcans = Integer.toString((int)ANS);
				double uans2 = Double.parseDouble(uans);
				if(uans2==ANS)
					forAppend.append("���ߵ���I\n�z�����׬��G").append(uans).append("\n���T���׬��G")
					.append(dcans).append("\n");
				else 
					forAppend.append("���~�A�z�����׬��G").append(uans).append("\n���T���׬��G")
					.append(dcans).append("\n");
			}catch(NumberFormatException e) {
				forAppend.append("�L�Ŀ�J�G").append(uans).append("\n���T���׬��G")
				.append(dcans).append("\n");
			}
		}else {
			
			dcans = Double.toString(ANS);
			try {
				int ptadr = 0;
				double uans2 = Double.parseDouble(uans);
				char[] euans = Double.toString(Arith.round(uans2, addr45)).toCharArray();
				char[] edans = dcans.toCharArray();
				boolean p = false;
				int len = edans.length<euans.length?edans.length:euans.length;
				for(int i=0;i<len;i++) {
					if(!p) {
						if(edans[i]=='.') {
							p = true;
							ptadr = i;
						}
						if(edans[i]!=euans[i]) {
							forAppend.append("���~�A�z�����׬��G").append(uans).append("\n���T���׬��G")
							.append(dcans).append("\n");
							return forAppend.toString();
						}
					}else {
						if(edans[i]!=euans[i]) {
							forAppend.append("�p�ƥH�U").append(count).append("�쥿�T\n�A�z�����׬��G")
							.append(uans).append("\n���T���׬��G").append(dcans).append("\n");
							return forAppend.toString();
						}
						count++;
					}
				}
				if(count<edans.length-ptadr-1) {
					System.out.println(count);
					System.out.println(edans.length-ptadr);
					forAppend.append("�p�ƥH�U").append(count).append("�쥿�T\n�A�z�����׬��G")
					.append(uans).append("\n���T���׬��G").append(dcans).append("\n");
					return forAppend.toString();
				}
				forAppend.append("���ߵ���I\n�z�����׬��G").append(uans).append("\n���T���׬��G")
				.append(dcans).append("\n");
			}catch(NumberFormatException e) {
				forAppend.append("�L�Ŀ�J�G").append(uans).append("\n���T���׬��G")
				.append(dcans).append("\n");
				return forAppend.toString();
			}
		}
		return forAppend.toString();
	}
	public String display(int f,int s,String op,int scale) {
		String[] strs = new String[f];
//		StringBuffer buf = new StringBuffer();
		int[] operand = new int[f];
		this.op = op;
		boolean[] nag = new boolean[f]; 
		nag[0] = false;
		for(int i=1;i<f;i++)
			nag[i] = ran.nextBoolean();
		int[] nufl = new int[f]; 
		for(int i=0;i<f;i++)
			nufl[i] = ran.nextInt(s)+1;
		boolean nreach = false;
		for(int i=0;i<f;i++)
			nreach = nufl[i]!=s?true:false;
		if(nreach)
			nufl[ran.nextInt(f)] = s;
		if(UNF&&NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = nag[i]==true?-linkNums(s):linkNums(s);
				strs[i] = Integer.toString(operand[i]);
			}
			
		}else if(!UNF&&NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = nag[i]==true?-linkNums(nufl[i]):linkNums(nufl[i]);	
				strs[i] = Integer.toString(operand[i]);
			}

		}else if(UNF&&!NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = linkNums(s);
				strs[i] = Integer.toString(operand[i]);
			}
			
		}else if(!UNF&&!NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = linkNums(nufl[i]);
				strs[i] = Integer.toString(operand[i]);
			}	
		}
		ANS = compute(operand,op,scale);
		return formate(strs,f,s,op);
	}
	public String display(int f,int s,int t,String op,int scale) {
		String[] strs = new String[f];
		StringBuffer buf = new StringBuffer();
		double[] operand = new double[f];
		this.op = op;
		boolean[] nag = new boolean[f]; 
		nag[0] = false;
		for(int i=1;i<f;i++)
			nag[i] = ran.nextBoolean();
		
		int[] nuflb = new int[f];
		int[] nufla = new int[f]; 
		for(int i=0;i<f;i++) {
			nuflb[i] = ran.nextInt(s)+1;
			nufla[i] = ran.nextInt(t)+1;
		}
		boolean nreachb = false;
		boolean nreacha = false;
		for(int i=0;i<f;i++) {
			nreachb = nuflb[i]!=s?true:false;
			nreacha = nufla[i]!=t?true:false;
		}	
		if(nreachb)
			nuflb[ran.nextInt(f)] = s;
		if(nreacha)
			nufla[ran.nextInt(f)] = t;
		
		if(UNF&&NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = nag[i]==true?-linkNums(s,t):linkNums(s,t);
				strs[i] = Double.toString(operand[i]);
			}
			
		}else if(!UNF&&NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = nag[i]==true?-linkNums(nuflb[i],nufla[i]):linkNums(nuflb[i],nufla[i]);	
				strs[i] = Double.toString(operand[i]);
			}

		}else if(UNF&&!NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = linkNums(s,t);
				strs[i] = Double.toString(operand[i]);
			}
			
		}else if(!UNF&&!NAG) {
			for(int i=0;i<f;i++) {
				operand[i] = linkNums(nuflb[i],nufla[i]);
				strs[i] = Double.toString(operand[i]);
			}	
		}
		ANS = compute(operand,op,scale);
		return formate(strs,f,s,t,op);
	
	}
	private double compute(int[] operand,String op,int scale) {
		double sum = 0;
		if(op.equals("�[��")) {
			for(int i:operand)
				sum += i;
		}else if(op.equals("��")) {
			sum = 1;
			for(int i:operand)
				sum *= i;
		}else if(op.equals("��")) {
			try {
				sum = Arith.div(operand[0],operand[1], scale);
			}catch(ArithmeticException ae) {
				errors[0] = true;
			}
			
		}else errors[1] = true;
		
		return sum;
	}
	private double compute(double[] operand,String op,int scale) {
		double sum = 0;
		if(op.equals("�[��")) {
			for(double i:operand)
				sum = Arith.round(Arith.add(sum, i),scale);
		}else if(op.equals("��")) {
			sum = 1;
			for(double i:operand)
				sum = Arith.round(Arith.mul(sum, i), scale);
			
		}else if(op.equals("��")) {
			try {
				sum = Arith.div(operand[0],operand[1], scale);
			}catch(ArithmeticException ae) {
				errors[0] = true;
			}
		}else errors[1] = true;
		return sum;
	}
	
	private String formate(String[] strs,int f,int s,String op) {
		StringBuffer buf = new StringBuffer();
		StringBuffer pattern = new StringBuffer();
		pattern.append("%").append(s+4).append("s");
		String pattern1 = pattern.toString();
		pattern = new StringBuffer();
		pattern.append("%-2s%").append(s+1).append("s");
		String pattern2 = pattern.toString();
		if(IAD) {//Integer true
			buf.append(String.format(pattern1, strs[0])).append("\n");
			for(int i=1;i<strs.length;i++) {
				
				if(op.equals("�[��")) {
					if(strs[i].startsWith("-")) {
						buf.append(String.format(pattern2, "-",strs[i].substring(1)));
						buf.append("\n");
					}else {
						buf.append(String.format(pattern2, "+",strs[i]));
						buf.append("\n");
					}
		
				}else if(op.equals("��")) {
					buf.append(String.format(pattern2, "x(",strs[i]));
					buf.append("\n");
				}else if(op.equals("��")) {
					buf.append(String.format(pattern2, "��(",strs[i]));
					buf.append("\n");
				}
			}
			for(int i=0;i<s+3;i++)
				buf.append("=");
			buf.append("\n");
		}else System.out.println("�o�Ϳ��~");
		
		return buf.toString();
	}
	private String formate(String[] strs,int f,int s,int t,String op) {
		StringBuffer buf = new StringBuffer();
		StringBuffer pattern = new StringBuffer();
		pattern.append("%").append(s+4).append("s%s%-").append(t).append("s");
		String pattern1 = pattern.toString();
		pattern = new StringBuffer();
		pattern.append("%-2s%").append(s+1).append("s%s%-").append(t).append("s");;
		String pattern2 = pattern.toString();
		int pt = 0;
		if(!IAD) {//Integer true
			pt=strs[0].indexOf(".");
			buf.append(String.format(pattern1, strs[0].substring(0,pt),"�O",strs[0].substring(pt+1))).append("\n");
			for(int i=1;i<strs.length;i++) {
				//another �O
				if((pt=strs[i].indexOf("."))!=-1) {
					if(op.equals("�[��")) {
						if(strs[i].startsWith("-")) {
							buf.append(String.format(pattern2, "-",strs[i].substring(1,pt),"�O",strs[i].substring(pt+1)));
							buf.append("\n");
						}else {
							buf.append(String.format(pattern2, "+",strs[i].substring(0,pt),"�O",strs[i].substring(pt+1)));
							buf.append("\n");
						}
			
					}else if(op.equals("��")) {
						buf.append(String.format(pattern2, "x(",strs[i].substring(0,pt),"�O",strs[i].substring(pt+1)));
						buf.append("\n");
					}else if(op.equals("��")) {
						buf.append(String.format(pattern2, "��(",strs[i].substring(0,pt),"�O",strs[i].substring(pt+1)));
						buf.append("\n");
					}//
				
				}else {//no '.'
					buf.append("0.0");
					buf.append("\n");
					System.out.println("�o�Ϳ��~");
				}
				
			}
			for(int i=0;i<s+t+4;i++)//may not enough
				buf.append("=");
			buf.append("\n");
		}else System.out.println("�o�Ϳ��~");
		return buf.toString();
	}
	
	
	
	private int linkNums(int times) {
		StringBuffer buf = new StringBuffer();
		buf.append(ranNoZero());
		for(int i=0;i<times-1;i++)
			buf.append(ranNumber());
		int re =Integer.parseInt(buf.toString());
		return re;
	}
	private double linkNums(int before,int after) {
		StringBuffer buf = new StringBuffer();
		buf.append(ranNoZero());
		for(int i=0;i<before-1;i++)
			buf.append(ranNumber());
		buf.append('.');
		for(int i=0;i<after-1;i++)
			buf.append(ranNumber());
		buf.append(ranNoZero());
		return Double.parseDouble(buf.toString());
	}
	private int ranNumber() {
		int i;
		i = ran.nextInt(10);
		return i;
	}
	private int ranNoZero() {
		int i;
		i = ran.nextInt(9)+1;
		return i;
	}
}
class AnswerPane{
	private JTextPane[] respectiveText = null;
	private JPanel thePane = null;
	private Dimension dim = null;
	private Font sserif = null;
	private SpringLayout layout = null;
	private JScrollPane scrollPane = null;
	
	public void updatePane(String str) {
		
		StringBuffer[] buf = null;
//		StringBuffer lstbuf = new StringBuffer();
		char[] ele = str.toCharArray();
		int rowlen = 0;
		boolean dfr = false;
		
		try {
			for(int i=0;i<ele.length;i++) {//each column has comply
				if (dfr) {
					if(ele[i]=='\n') {
						rowlen = 0;
					}else {
						
						
						buf[rowlen].append(ele[i]).append("\n");
						rowlen++;
					}
				}else {
					if(ele[i]=='\n') {
					
						buf = new StringBuffer[rowlen];
						for(int j=0;j<rowlen;j++)
							buf[j] = new StringBuffer(); 
						i = 0;
						rowlen = 0;
						dfr=true;
					}else {
						rowlen++;
					}
				}
			}
		}catch(IndexOutOfBoundsException e) {
			e.printStackTrace();
		}
		for(int i=0;i<20;i++) {	
			respectiveText[i].setText("");
		}
		for(int i=0;i<buf.length;i++) {	
			respectiveText[i].setText(buf[i].toString());
		}
	}
	public JScrollPane getPane() {
		return this.scrollPane;
	}
	public void initPane(KeyListener kl) throws IOException {
		dim = new Dimension(15,220);
		sserif = new Font("SansSerif",1,18);
		layout = new SpringLayout();
		thePane = new JPanel();
		scrollPane = new JScrollPane();
		scrollPane.setPreferredSize(new Dimension(303,223));
		thePane.setLayout(layout);
		thePane.setPreferredSize(new Dimension(298,220));
		respectiveText = new JTextPane[20];
		for(int i=0;i<20;i++) {
			respectiveText[i] = new JTextPane();
			respectiveText[i].setEditable(false);
			respectiveText[i].setPreferredSize(dim);
			respectiveText[i].setBackground(Color.BLACK);
			respectiveText[i].setCaretColor(Color.white);
			respectiveText[i].setForeground(Color.white);
			respectiveText[i].setFont(sserif);
			respectiveText[i].addKeyListener(kl);
			
			thePane.add(respectiveText[i]);
			layout.putConstraint(SpringLayout.NORTH, respectiveText[i]
					, 0, SpringLayout.NORTH, thePane);
			if(i==0) {
				layout.putConstraint(SpringLayout.WEST, respectiveText[i]
						, 0, SpringLayout.WEST, thePane);
			}else {
				layout.putConstraint(SpringLayout.WEST, respectiveText[i]
						, 0, SpringLayout.EAST, respectiveText[i-1]);
			}
		}
		scrollPane.setViewportView(thePane);
		
	}
//	public void initPane(String str,KeyListener kl) throws IOException {
//		StringBuffer[] buf = null;
//		char[] ele = str.toCharArray();
//		int rowlen = 0;
//		boolean dfr = false;
//		dim = new Dimension(15,270);
//		sserif = new Font("SansSerif",1,18);
//		layout = new SpringLayout();
//		thePane = new JPanel();
//		scrollPane = new JScrollPane();
//		scrollPane.setPreferredSize(new Dimension(90,250));
//		try {
//			for(int i=0;i<ele.length;i++) {//each column has comply
//				if (dfr) {
//					if(ele[i]=='\n') {
//						rowlen = 0;
//					}else {
//						buf[rowlen].append(ele[i]).append("\n");
//						rowlen++;
//					}
//				}else {
//					if(ele[i]=='\n') {
//						buf = new StringBuffer[rowlen];
//						for(int j=0;j<rowlen;j++)
//							buf[j] = new StringBuffer(); 
//						i = 0;
//						rowlen = 0;
//						dfr=true;
//					}else {
//						rowlen++;
//					}
//				}
//			}
//		}catch(IndexOutOfBoundsException e) {
//			
//		}
//		respectiveText = new JTextPane[20];
//		for(int i=0;i<rowlen;i++) {
//			respectiveText[i] = new JTextPane();
//			respectiveText[i].setBackground(Color.BLACK);
//			respectiveText[i].setCaretColor(Color.white);
//			respectiveText[i].setForeground(Color.white);
//			respectiveText[i].setFont(sserif);
//			respectiveText[i].addKeyListener(kl);
//			respectiveText[i].setText(buf[i].toString());
//			
//			thePane.add(respectiveText[i]);
//			layout.putConstraint(SpringLayout.NORTH, respectiveText[i]
//					, 0, SpringLayout.NORTH, thePane);
//			if(i==0) {
//				layout.putConstraint(SpringLayout.WEST, respectiveText[i]
//						, 0, SpringLayout.WEST, thePane);
//			}else {
//				layout.putConstraint(SpringLayout.WEST, respectiveText[i]
//						, 0, SpringLayout.EAST, respectiveText[i-1]);
//			}
//		}
//		scrollPane.add(thePane);
//	}
	
}
class Arith{
    //�q�{���k�B����
    private static final int DEF_DIV_SCALE = 10;

    //�o���������Ҥ�
    private Arith() {
    }


/**
 * ���Ѻ�T���[�k�B��C
 * @param v1 �Q�[��
 * @param v2 �[��
 * @return ��ӰѼƪ��M
 */
public static double add(double v1,double v2) {
    BigDecimal b1 = new BigDecimal(Double.toString(v1));
    BigDecimal b2 = new BigDecimal(Double.toString(v2));
    return b1.add(b2).doubleValue();
}

/**
 * ���Ѻ�T����k�B��C
 * @param v1 �Q���
 * @param v2 ���
 * @return ��ӰѼƪ��t
 */
public static double sub(double v1,double v2) {
    BigDecimal b1 = new BigDecimal(Double.toString(v1));
    BigDecimal b2 = new BigDecimal(Double.toString(v2));
    return b1.subtract(b2).doubleValue();
}

/**
 * ���Ѻ�T�����k�B��C
 * @param v1 �Q����
 * @param v2 ����
 * @return ��ӰѼƪ��n
*/
public static double mul(double v1,double v2) {
    BigDecimal b1 = new BigDecimal(Double.toString(v1));
    BigDecimal b2 = new BigDecimal(Double.toString(v2));
    return b1.multiply(b2).doubleValue();
}

/**
 * ���ѡ]�۹�^��T�����k�B��A��o�Ͱ����ɪ����p�ɡA��T��
 * �p���I�H��10�줸�A�H�᪺�Ʀr�|�ˤ��J�C
 * @param v1 �Q����
 * @param v2 ����
 * @return ��ӰѼƪ���
 */
public static double div(double v1,double v2) {
    return div(v1,v2,DEF_DIV_SCALE);
}

/**
 * ���ѡ]�۹�^��T�����k�B��C��o�Ͱ����ɪ����p�ɡA��scale�Ѽƫ�
 * �w��סA�H�᪺�Ʀr�|�ˤ��J�C
 * @param v1 �Q����
 * @param v2 ����
 * @param scale ��ܪ�ܻݭn��T��p���I�H��X��C
 * @return ��ӰѼƪ���
*/
public static double div(double v1,double v2,int scale) {
    if (scale < 0) {
         throw new IllegalArgumentException(
         "The scale must be a positive integer or zero");
     }
    BigDecimal b1 = new BigDecimal(Double.toString(v1));
    BigDecimal b2 = new BigDecimal(Double.toString(v2));
    return b1.divide(b2,scale,BigDecimal.ROUND_HALF_UP).doubleValue();
}

/**
 * ���Ѻ�T���p�Ʀ�|�ˤ��J�B�z�C
 * @param v �ݭn�|�ˤ��J���Ʀ�
 * @param scale �p���I��O�d�X��
 * @return �|�ˤ��J�᪺���G
 */
public static double round(double v,int scale) {
    if ( scale < 0) {
        throw new IllegalArgumentException(
        "The scale must be a positive integer or zero");
    }
    BigDecimal b = new BigDecimal(Double.toString(v));
    BigDecimal one = new BigDecimal("1");
    return b.divide(one,scale,BigDecimal.ROUND_HALF_UP).doubleValue();
    }
}


abstract class BasicWindow extends JFrame {

	boolean pack; 
	private Container content = this.getContentPane();
	private static BasicWindowMonitor basic = null;
	
	private static class BasicWindowMonitor extends WindowAdapter{
		private static Container content;
		BasicWindowMonitor(Container content){
			BasicWindowMonitor.content = content;
			
		}
		public void windowClosing(WindowEvent e) {	
			int opt = JOptionPane.showConfirmDialog(content, "Are you sure to quit?","",JOptionPane.YES_NO_OPTION);
			if(opt == JOptionPane.YES_NO_OPTION) {
				System.exit(0);
			}		
		}
		
	}
	protected static BasicWindowMonitor getBasic(Container content) {
		if(basic==null) {
			synchronized(BasicWindowMonitor.class) {
				if(basic==null) {
					basic = new BasicWindowMonitor(content);
				}
			}
		}
		return basic;
	}

	
	public void execute() {
		
		addWindowListener(getBasic(this.content));
		setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
		edit();
		setSize(500,600);
//		pack();
		setVisible(true);

	}
	
	abstract void edit();
}





